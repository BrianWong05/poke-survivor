import Phaser from 'phaser';
import { type EnemyStats, type EnemyType, EnemyTier } from '@/game/entities/enemies/EnemyConfig';
import { DexManager } from '@/systems/DexManager';
import { EnemyMovement } from './components/EnemyMovement';
import { EnemyVisuals } from './components/EnemyVisuals';

/**
 * Base Enemy class extending Phaser.Physics.Arcade.Sprite.
 * Handles HP, damage, and coordinates Movement and Visuals components.
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  /** Current hit points */
  public hp: number = 0;

  /** Maximum hit points */
  public maxHP: number = 0;

  /** Movement speed in pixels per second */
  public speed: number = 0;

  /** Reference to the player sprite (movement target) */
  public target: Phaser.Physics.Arcade.Sprite | null = null;

  /** Enemy type identifier */
  public enemyType: EnemyType | null = null;

  /** Whether this enemy is a boss (immune to instakill) */
  public isBoss: boolean = false;

  /** Whether this enemy is currently dying (prevents multiple death triggers) */
  public isDying: boolean = false;

  /** Timestamp of the last time this enemy took hazard damage */
  public lastHazardHitTime: number = 0;

  /** Unique instance ID for hit tracking safety */
  public readonly instanceId: string;

  /** Damage dealt on contact */
  public damage: number = 1;

  /** Timestamp of last attack on player (per-enemy cooldown) */
  public lastAttackTime: number = 0;

  // Components
  public movement: EnemyMovement;
  public visuals: EnemyVisuals;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    
    this.instanceId = Phaser.Utils.String.UUID();

    // Components
    this.movement = new EnemyMovement(this);
    this.visuals = new EnemyVisuals(this);

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDrag(500); // Add drag so knockback decays
    this.setDepth(5); // Ensure enemies render above background but below player (10)
    
    // Scale up enemies for better presence
    this.setScale(1.5);

    // Reduce hitbox size to 70% of visual to be more forgiving/fair
    const width = this.width;
    const height = this.height;
    this.setBodySize(width * 0.7, height * 0.7);
    this.setOffset(width * 0.15, height * 0.15);
  }

  /**
   * Initialize or reset the enemy with given stats and target.
   * Called when spawning or recycling from pool.
   */
  public init(stats: EnemyStats, target: Phaser.Physics.Arcade.Sprite, enemyType: EnemyType): void {
    this.maxHP = stats.maxHP;
    this.hp = stats.maxHP;
    this.speed = stats.speed;
    this.damage = stats.damage;
    this.target = target;
    this.enemyType = enemyType;
    this.isBoss = stats.tier === EnemyTier.BOSS;
    this.isDying = false;
    this.lastAttackTime = 0; // Reset attack timer for recycled enemies

    // Check if main texture exists, otherwise use fallback
    if (this.scene.textures.exists(stats.textureKey)) {
      this.setTexture(stats.textureKey);
    } else {
      this.setTexture('fallback-' + stats.textureKey);
    }

    // Reset visual state and physics
    this.setActive(true);
    this.setVisible(true);
    this.setAlpha(1);
    this.clearTint();
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).checkCollision.none = false;
    }

    // Set physics body mass if specified
    if (stats.mass && this.body) {
      (this.body as Phaser.Physics.Arcade.Body).mass = stats.mass;
    }

    // Assign unique ID for this lifecycle (hit tracking)
    this.setData('uid', Phaser.Utils.String.UUID());
    
    // Init Components
    this.movement.init(this.speed);
    this.visuals.init();
  }

  /**
   * Called every frame before physics update.
   */
  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.active || this.isDying || !this.target) return;

    // Delegate to components
    this.movement.update(delta);
    this.visuals.update();
  }

  /**
   * Apply damage to this enemy.
   * Triggers hit flash and death if HP <= 0.
   */
  public takeDamage(amount: number, isCrit: boolean = false): void {
    if (this.isDying || !this.active) return;
    
    // Handle Critical Hits
    if (isCrit) {
      this.visuals.showCritText();
      
      if (this.isBoss) {
        amount *= 2; // Bosses take double damage
      } else {
        amount = this.hp; // Instakill non-bosses
      }
    }

    this.hp -= amount;
    
    // Flash white on hit
    this.visuals.flashHit(this.movement.isParalyzed);
    
    // Impact "Pop"
    this.visuals.playDonutSquash();

    if (this.hp <= 0) {
      this.die();
    }
  }

  /**
   * Check if this enemy can attack the player (per-enemy cooldown).
   * @param time Current game time in ms
   * @returns true if cooldown has elapsed (500ms)
   */
  public canAttack(time: number): boolean {
    return time > this.lastAttackTime + 500;
  }

  /**
   * Record that this enemy attacked the player.
   * @param time Current game time in ms
   */
  public onAttack(time: number): void {
    this.lastAttackTime = time;
  }

  // --- Delegation Methods ---

  public applyKnockback(force: Phaser.Math.Vector2, duration: number): void {
      this.movement.applyKnockback(force, duration);
  }

  public paralyze(duration: number): void {
      this.visuals.flashHit(true); // Visual feedback immediately
      this.movement.paralyze(duration);
  }
  
  public handleParalysisCured(): void {
      this.visuals.flashHit(false); // Restore tint
  }
  
  // Expose isKnockedBack for systems checking it (like MainScene?)
  public get isKnockedBack(): boolean {
      return this.movement.isKnockedBack;
  }
  
  public get isParalyzed(): boolean {
      return this.movement.isParalyzed;
  }

  /**
   * Handle enemy death: play fade-out tween, emit event, return to pool.
   */
  protected die(): void {
    if (this.isDying) return;
    console.log(`[Enemy] ${this.getData('uid') || 'NoID'} Dying.`);
    this.isDying = true;

    // Stop movement and disable physics body
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      (this.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;
    }

    // Emit death event with position and type for loot spawning
    this.scene.events.emit('enemy:death', this.x, this.y, this.enemyType);

    // Mark as unlocked in Dex
    if (this.enemyType) {
      DexManager.getInstance().markUnlocked(this.enemyType);
    }

    // Play fade-out tween and return to pool
    this.visuals.playDeathTween(() => this.returnToPool());
  }

  /**
   * Deactivate and hide the enemy, returning it to the pool.
   */
  protected returnToPool(): void {
    console.log(`[Enemy] ${this.getData('uid') || 'NoID'} Returned to Pool.`);
    this.setActive(false);
    this.setVisible(false);
    this.hp = 0;
    this.isDying = false;
    this.target = null;
    
    // Stop all velocity
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    }
  }

  /**
   * Force kill the enemy immediately (e.g., for instant-kill effects).
   */
  public forceKill(): void {
    if (!this.active) return;
    this.hp = 0;
    this.die();
  }
}
