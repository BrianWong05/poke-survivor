import Phaser from 'phaser';
import { Player } from '@/game/entities/Player';
import { type CharacterContext, type CharacterConfig, type CharacterState } from '@/game/entities/characters/types';
import { ENEMY_STATS, EnemyType } from '@/game/entities/enemies';
import { LootManager } from '@/game/systems/LootManager';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { CollisionManager } from '@/game/systems/CollisionManager';

/**
 * CombatManager handles the high-level logic for damage, healing, 
 * and combat interactions between entities.
 */
export class CombatManager {
  private scene: Phaser.Scene;
  private player: Player;
  private characterConfig: CharacterConfig;
  private characterState: CharacterState;
  private lootManager: LootManager;
  private collisionManager: CollisionManager;
  
  private isGameOver: () => boolean;
  private triggerGameOver: () => void;
  
  constructor(
    scene: Phaser.Scene, 
    player: Player, 
    config: CharacterConfig, 
    state: CharacterState,
    lootManager: LootManager,
    _callbacks: unknown,
    isGameOver: () => boolean,
    triggerGameOver: () => void
  ) {
    this.scene = scene;
    this.player = player;
    this.characterConfig = config;
    this.characterState = state;
    this.lootManager = lootManager;
    this.isGameOver = isGameOver;
    this.triggerGameOver = triggerGameOver;
    this.collisionManager = new CollisionManager(scene);
  }

  /**
   * Initializes all combat collisions.
   */
  public setupCollisions(
    enemySpawner: EnemySpawner,
    projectilesGroup: Phaser.Physics.Arcade.Group,
    hazardGroup: Phaser.Physics.Arcade.Group
  ): void {
    this.collisionManager.setupCombatCollisions(
      {
        player: this.player,
        enemySpawner,
        projectiles: projectilesGroup,
        hazards: hazardGroup
      },
      {
        onProjectileEnemy: this.handleProjectileEnemyCollision.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        onPlayerEnemy: this.handlePlayerEnemyCollision.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        onEnemyHazard: this.handleHazardDamage.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
      }
    );
  }

  public healPlayer(amount: number): void {
    if (this.isGameOver()) return;
    this.player.heal(amount);
  }

  public applyAOEDamage(x: number, y: number, radius: number, damage: number, enemies: Phaser.Physics.Arcade.Group): void {
    enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
        this.damageEnemy(enemy, damage);
      }
    });
  }

  public damageEnemy(enemy: Phaser.Physics.Arcade.Sprite, damage: number): void {
    const finalDamage = enemy.getData('shadowTagged') ? Math.floor(damage * 1.25) : damage;

    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
      (enemy as any).takeDamage(finalDamage);
      return;
    }

    const currentHP = (enemy.getData('hp') as number) || 20;
    const newHP = currentHP - finalDamage;

    if (newHP <= 0) {
      this.handleEnemyDeath(enemy);
    } else {
      enemy.setData('hp', newHP);
    }
  }

  private handleEnemyDeath(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (enemy.getData('healOnKill') && enemy.getData('cursed')) {
      this.healPlayer(1);
    }

    const type = enemy.getData('type') as EnemyType;
    const stats = ENEMY_STATS[type];
    if (stats) {
      this.lootManager.drop(enemy.x, enemy.y, stats.tier);
    }
    
    enemy.setActive(false).setVisible(false);
  }

  private handleProjectileEnemyCollision(
    projectileObj: Phaser.Physics.Arcade.Sprite,
    enemyObj: Phaser.Physics.Arcade.Sprite
  ): void {
    let [projectile, enemy] = [projectileObj, enemyObj];

    // Canonicalize arguments (ensure projectile is really a projectile)
    if (!this.isProjectile(projectile) && this.isProjectile(enemy)) {
      [projectile, enemy] = [enemy, projectile];
    }

    if (!this.isProjectile(projectile)) return;

    // Custom onHit handler
    if ('onHit' in projectile && typeof (projectile as any).onHit === 'function') {
      (projectile as any).onHit(enemy);
      return;
    }

    const damage = (projectile.getData('damage') as number) || this.characterConfig.stats.baseDamage;
    this.handleProjectilePierce(projectile);

    if (projectile.getData('explodes')) {
      this.scene.events.emit('spawn-aoe-damage', enemy.x, enemy.y, 80, damage);
    }

    const finalDamage = projectile.getData('critKill') && Math.random() < 0.2 ? 9999 : damage;
    this.damageEnemy(enemy, finalDamage);
  }

  private isProjectile(obj: Phaser.Physics.Arcade.Sprite): boolean {
    return 'onHit' in obj || obj.getData('pierceCount') !== undefined || obj.getData('damage') !== undefined;
  }

  private handleProjectilePierce(projectile: Phaser.Physics.Arcade.Sprite): void {
    const pierceCount = projectile.getData('pierceCount') as number;
    if (pierceCount && pierceCount > 0) {
      projectile.setData('pierceCount', pierceCount - 1);
    } else {
      projectile.setActive(false).setVisible(false).clearTint().setScale(1);
    }
  }

  private handlePlayerEnemyCollision(
    _playerObj: unknown,
    enemyObj: Phaser.Physics.Arcade.Sprite
  ): void {
    if (this.isGameOver() || this.player.getData('debugInvincible')) return;

    const enemy = enemyObj;
    const now = this.scene.time.now;

    if ((enemy as any).canAttack && !(enemy as any).canAttack(now)) return;

    const ctx = this.getCharacterContext();
    this.characterConfig.passive.onEnemyTouch?.(ctx, enemy);

    let damage = (enemy as any).damage || 1;
    damage = this.characterConfig.passive.onDamageTaken?.(ctx, damage, 'normal') ?? damage;

    this.handleDestinyBond(damage);
    this.player.takeDamage(damage);
    (enemy as any).onAttack?.(now);

    if (this.characterState.currentHP <= 0) {
      this.triggerGameOver();
    }
  }

  private handleDestinyBond(damage: number): void {
    if (this.player.getData('destinyBondActive')) {
      const linked = this.player.getData('destinyBondedEnemies') as Phaser.Physics.Arcade.Sprite[] || [];
      linked.filter(e => e.active).forEach(e => this.damageEnemy(e, damage * 5));
    }
  }

  private handleHazardDamage(
    enemyObj: Phaser.Physics.Arcade.Sprite,
    hazardObj: Phaser.Physics.Arcade.Sprite
  ): void {
    if (!enemyObj.active || !hazardObj.active) return;

    const damage = (hazardObj as any).damagePerTick || 0;
    const tickRate = (hazardObj as any).tickRate || 500;
    const lastHit = (enemyObj as any).lastHazardHitTime || 0;
    const now = this.scene.time.now;

    if (now > lastHit + tickRate) {
      this.damageEnemy(enemyObj, damage);
      (enemyObj as any).lastHazardHitTime = now;
    }
  }

  private getCharacterContext(): CharacterContext {
    return {
      scene: this.scene,
      player: this.player,
      stats: this.characterConfig.stats,
      currentHP: this.characterState.currentHP,
      level: this.characterState.level,
      xp: this.characterState.xp,
    };
  }
}