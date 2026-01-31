import Phaser from 'phaser';
import { Player } from '@/game/entities/Player';
import { type CharacterContext, type CharacterConfig, type CharacterState } from '@/game/entities/characters/types';
import { ENEMY_STATS, EnemyType } from '@/game/entities/enemies';
import { LootManager } from '@/game/systems/LootManager';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import type { GameCallbacks } from '@/game/config';

export class CombatManager {
  private scene: Phaser.Scene;
  private player: Player;
  private characterConfig: CharacterConfig;
  private characterState: CharacterState;
  private lootManager: LootManager;
  private callbacks: GameCallbacks;
  
  // Game state flag reference (needs to be passed or accessed)
  private isGameOver: () => boolean;
  private triggerGameOver: () => void;
  
  constructor(
      scene: Phaser.Scene, 
      player: Player, 
      config: CharacterConfig, 
      state: CharacterState,
      lootManager: LootManager,
      callbacks: GameCallbacks,
      isGameOver: () => boolean,
      triggerGameOver: () => void
  ) {
    this.scene = scene;
    this.player = player;
    this.characterConfig = config;
    this.characterState = state;
    this.lootManager = lootManager;
    this.callbacks = callbacks;
    this.isGameOver = isGameOver;
    this.triggerGameOver = triggerGameOver;
  }

  public setupCollisions(
      enemySpawner: EnemySpawner,
      projectilesGroup: Phaser.Physics.Arcade.Group,
      hazardGroup: Phaser.Physics.Arcade.Group
  ): void {
      
    // Projectiles overlap Enemies
    const enemyPools = [
      enemySpawner.getRattataPool(),
      enemySpawner.getGeodudePool(),
      enemySpawner.getZubatPool(),
    ];

    const handleProjectileCollision = this.handleProjectileEnemyCollision.bind(this);
    const handlePlayerCollision = this.handlePlayerEnemyCollision.bind(this);
    const handleHazardCollision = this.handleHazardDamage.bind(this);

    enemyPools.forEach((pool) => {
      this.scene.physics.add.overlap(
        projectilesGroup,
        pool,
        handleProjectileCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this.scene
      );

      // Enemy touches player
      this.scene.physics.add.overlap(
        this.player,
        pool,
        handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this.scene
      );

      // Enemy overlaps hazard
      this.scene.physics.add.overlap(
        pool,
        hazardGroup,
        handleHazardCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this.scene
      );
    });

    // Legacy support (Removed to prevent double-collision)
    /* 
    this.scene.physics.add.overlap(
      projectilesGroup,
      enemiesGroup,
      handleProjectileCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this.scene
    );

    this.scene.physics.add.overlap(
      this.player,
      enemiesGroup,
      handlePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this.scene
    );
    */
  }

  public healPlayer(amount: number): void {
    if (this.isGameOver()) return;
    this.player.heal(amount);
  }

  public applyAOEDamage(x: number, y: number, radius: number, damage: number, enemies: Phaser.Physics.Arcade.Group): void {
    enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (dist <= radius) {
        this.damageEnemy(enemy, damage);
      }
    });
  }

  public damageEnemy(enemy: Phaser.Physics.Arcade.Sprite, damage: number): void {
    // Apply Shadow Tag +25% damage bonus
    let finalDamage = damage;
    if (enemy.getData('shadowTagged')) {
      finalDamage = Math.floor(damage * 1.25);
    }

    // Check if this is a new Enemy class instance (has takeDamage method)
    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
      (enemy as any).takeDamage(finalDamage);
      return;
    }

    // Legacy enemy handling
    const currentHP = (enemy.getData('hp') as number) || 20;
    const newHP = currentHP - finalDamage;

    if (newHP <= 0) {
      // Check for Dream Eater heal
      if (enemy.getData('healOnKill') && enemy.getData('cursed')) {
        this.healPlayer(1);
      }

      // Spawn Exp Candy via LootManager
      const stats = ENEMY_STATS[enemy.getData('type') as EnemyType];
      if (stats) {
        this.lootManager.drop(enemy.x, enemy.y, stats.tier);
      }
      enemy.setActive(false);
      enemy.setVisible(false);
    } else {
      enemy.setData('hp', newHP);
    }
  }

  private handleProjectileEnemyCollision(
    projectileObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    let projectile = projectileObj as Phaser.Physics.Arcade.Sprite;
    let enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Detect Swapped Arguments
    // If 'enemy' has projectile properties (onHit, pierceCount) and 'projectile' doesn't
    const enemyHasProjectileTraits = 'onHit' in enemy || (enemy.getData && (enemy.getData('pierceCount') !== undefined));
    const projectileHasProjectileTraits = 'onHit' in projectile || (projectile.getData && (projectile.getData('pierceCount') !== undefined));

    if (enemyHasProjectileTraits && !projectileHasProjectileTraits) {
        // Swap them
        const temp = projectile;
        projectile = enemy;
        enemy = temp;
    }

    // Guard against non-projectile objects being processed as projectiles
    if (!('onHit' in projectile || projectile.getData('pierceCount') !== undefined || projectile.getData('damage') !== undefined)) {
        return;
    }

    // Custom onHit handler
    if ('onHit' in projectile && typeof (projectile as any).onHit === 'function') {
      (projectile as any).onHit(enemy);
      return;
    }

    // Get damage
    const damage = (projectile.getData('damage') as number) || this.characterConfig.stats.baseDamage;

    // Handle piercing
    const pierceCount = projectile.getData('pierceCount') as number;
    if (pierceCount && pierceCount > 0) {
      projectile.setData('pierceCount', pierceCount - 1);
    } else {
      projectile.setActive(false);
      projectile.setVisible(false);
      projectile.clearTint();
      projectile.setScale(1);
    }

    // Exploding
    if (projectile.getData('explodes')) {
       // Note: checking legacy Enemies Group might assume it contains all enemies. 
       // For better safety, we'd need to emit an event or pass the group context better if needed.
       // But for now, we'll emit an event back to scene or rely on scene passing logic?
       // Let's emit to keep it decoupled.
       this.scene.events.emit('spawn-aoe-damage', enemy.x, enemy.y, 80, damage);
    }

    // Crit Kill
    if (projectile.getData('critKill') && Math.random() < 0.2) {
      this.damageEnemy(enemy, 9999);
    } else {
      this.damageEnemy(enemy, damage);
    }
  }

  private handlePlayerEnemyCollision(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    // Debug invincible check should be passed in or checked differently
    // We'll rely on local invincibility state + player data
    // Debug invincibility is handled by not calling this or checking a flag
    // We can assume if debug is on, we won't get hurt if we check a global or similar.
    // For now, check standard flags.
    // Debug invincible check
    if (this.isInverseGameOver() || this.player.isInvulnerable || this.player.getData('debugInvincible')) return;

    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Passive onEnemyTouch
    if (this.characterConfig.passive.onEnemyTouch) {
      const ctx = this.getCharacterContext();
      this.characterConfig.passive.onEnemyTouch(ctx, enemy);
    }

    // Do NOT destroy enemy on contact (Continuous Damage Style)
    // enemy.setActive(false);
    // enemy.setVisible(false);

    // Get damage from enemy stats (default 1)
    let damage = (enemy as any).damage || 1;

    // Apply passive modifiers
    if (this.characterConfig.passive.onDamageTaken) {
      const ctx = this.getCharacterContext();
      damage = this.characterConfig.passive.onDamageTaken(ctx, damage, 'normal');
    }

    // Destiny Bond
    if (this.player.getData('destinyBondActive')) {
      const linkedEnemies = this.player.getData('destinyBondedEnemies') as Phaser.Physics.Arcade.Sprite[] || [];
      linkedEnemies.forEach((linked) => {
        if (linked.active) {
          this.damageEnemy(linked, damage * 5);
        }
      });
    }

    // Delegate damage to Player (Handles invincibility and HP)
    this.player.takeDamage(damage);

    if (this.characterState.currentHP <= 0) {
      this.triggerGameOver();
      return;
    }
    
    // Invincibility is now handled inside Player.takeDamage()
  }

  // Helper for inversion because I used a function call in the condition
  private isInverseGameOver(): boolean {
      return this.isGameOver();
  }

  private handleHazardDamage(
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    hazardObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
    const hazard = hazardObj as Phaser.Physics.Arcade.Sprite;

    if (!enemy.active || !hazard.active) return;

    const damage = (hazard as any).damagePerTick || 0;
    const tickRate = (hazard as any).tickRate || 500;
    
    const lastHit = (enemy as any).lastHazardHitTime || 0;
    const now = this.scene.time.now;

    if (now > lastHit + tickRate) {
        this.damageEnemy(enemy, damage);
        (enemy as any).lastHazardHitTime = now;
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
