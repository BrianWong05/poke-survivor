import Phaser from 'phaser';
import { type EnemyStats, type EnemyType } from '@/game/entities/enemies/EnemyConfig';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';

/**
 * Base Enemy class extending Phaser.Physics.Arcade.Sprite.
 * Handles HP, damage, movement toward target, and death behavior.
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

  /** Current movement direction */
  private currentDirection: DirectionName = 'down';

  /** Whether this enemy is currently dying (prevents multiple death triggers) */
  private isDying: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  /**
   * Initialize or reset the enemy with given stats and target.
   * Called when spawning or recycling from pool.
   */
  public init(stats: EnemyStats, target: Phaser.Physics.Arcade.Sprite, enemyType: EnemyType): void {
    this.maxHP = stats.maxHP;
    this.hp = stats.maxHP;
    this.speed = stats.speed;
    this.target = target;
    this.enemyType = enemyType;
    this.currentDirection = 'down';
    this.isDying = false;

    // Reset visual state
    this.setActive(true);
    this.setVisible(true);
    this.setAlpha(1);
    this.clearTint();

    // Set physics body mass if specified
    if (stats.mass && this.body) {
      (this.body as Phaser.Physics.Arcade.Body).mass = stats.mass;
    }
  }

  /**
   * Called every frame before physics update.
   * Handles movement toward target and sprite flipping.
   */
  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.active || this.isDying || !this.target) return;

    // Move toward target
    this.moveTowardTarget();

    // Update visuals (animation or fallback flip)
    this.updateVisuals();
  }

  /**
   * Default movement behavior: move directly toward target.
   * Override in subclasses for custom AI.
   */
  protected moveTowardTarget(): void {
    if (!this.target || !this.scene) return;

    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  /**
   * Update sprite flip based on movement direction.
   */
  protected updateFlip(): void {
    if (!this.body) return;

    const velocity = (this.body as Phaser.Physics.Arcade.Body).velocity;
    if (velocity.x < 0) {
      this.setFlipX(true);
    } else if (velocity.x > 0) {
      this.setFlipX(false);
    }
  }

  /**
   * Apply damage to this enemy.
   * Triggers hit flash and death if HP <= 0.
   */
  public takeDamage(amount: number): void {
    if (this.isDying || !this.active) return;

    this.hp -= amount;

    // Flash white on hit
    this.flashHit();

    if (this.hp <= 0) {
      this.die();
    }
  }

  /**
   * Flash white tint for 100ms to indicate damage.
   */
  protected flashHit(): void {
    this.setTint(0xffffff);

    this.scene.time.delayedCall(100, () => {
      if (this.active && !this.isDying) {
        this.clearTint();
      }
    });
  }

  /**
   * Handle enemy death: play fade-out tween, emit event, return to pool.
   */
  protected die(): void {
    if (this.isDying) return;
    this.isDying = true;

    // Stop movement
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    }

    // Emit death event with position and type for loot spawning
    this.scene.events.emit('enemy:death', this.x, this.y, this.enemyType);

    // Play fade-out tween
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.returnToPool();
      },
    });
  }

  /**
   * Deactivate and hide the enemy, returning it to the pool.
   */
  protected returnToPool(): void {
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
  /**
   * Update visual state: try 8-way animation, fallback to flip.
   */
  protected updateVisuals(): void {
    if (!this.body) return;

    const velocity = (this.body as Phaser.Physics.Arcade.Body).velocity;
    const isMoving = velocity.x !== 0 || velocity.y !== 0;

    if (isMoving) {
      // Try 8-way animation
      const newDirection = getDirectionFromVelocity(velocity.x, velocity.y);
      const animKey = `${this.texture.key}-${newDirection}`;

      if (this.scene.anims.exists(animKey)) {
        // Only update if direction changed or not playing
        if (newDirection !== this.currentDirection || !this.anims.isPlaying) {
          this.currentDirection = newDirection;
          this.play(animKey, true);
        }
        this.setFlipX(false); // Ensure no legacy flip
        return;
      }
    }

    // Fallback: legacy flip
    this.updateFlip();
  }
}
