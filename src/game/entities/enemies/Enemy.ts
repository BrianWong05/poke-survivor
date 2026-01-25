import Phaser from 'phaser';
import { type EnemyStats, type EnemyType, EnemyTier } from '@/game/entities/enemies/EnemyConfig';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';
import { DexManager } from '@/systems/DexManager';

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

  /** Whether this enemy is a boss (immune to instakill) */
  public isBoss: boolean = false;

  /** Current movement direction */
  private currentDirection: DirectionName = 'down';

  /** Whether this enemy is currently dying (prevents multiple death triggers) */
  public isDying: boolean = false;

  /** Timestamp of the last time this enemy took hazard damage */
  public lastHazardHitTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

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
    this.target = target;
    this.enemyType = enemyType;
    this.isBoss = stats.tier === EnemyTier.BOSS;
    this.currentDirection = 'down';
    this.isDying = false;

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

    // Check for knockback/stun
    if (this.getData('knockbackUntil') > this.scene.time.now) return;

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
  public takeDamage(amount: number, isCrit: boolean = false): void {
    if (this.isDying || !this.active) return;

    // Handle Critical Hits
    if (isCrit) {
      this.showCritText();
      
      if (this.isBoss) {
        amount *= 2; // Bosses take double damage
      } else {
        amount = this.hp; // Instakill non-bosses
      }
    }

    this.hp -= amount;

    // Flash white on hit
    this.flashHit();
    
    // Impact "Pop" (Squash and Stretch)
    const currentScale = 1.5;
    this.scene.tweens.add({
      targets: this,
      scaleX: currentScale * 0.8, // Squish width
      scaleY: currentScale * 1.2, // Stretch height
      duration: 50,
      yoyo: true,
      ease: 'Power2'
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  /** Whether the enemy is paralyzed */
  public isParalyzed: boolean = false;

  /** Stored speed before paralysis */
  private originalSpeed: number = 0;

  /**
   * Apply paralysis status effect.
   * Stops movement and tints yellow.
   */
  public paralyze(duration: number): void {
    if (!this.active || this.isDying) return;

    // If not already paralyzed, store speed
    if (!this.isParalyzed) {
      this.originalSpeed = this.speed;
      this.isParalyzed = true;
      this.speed = 0;
      this.setTint(0xFFFF00);
      
      // Stop physics velocity immediately
      if (this.body) {
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      }
    }

    // Refresh duration if already paralyzed (optional, or just stack? simpler to just set timer)
    // For simplicity, we'll just set a timer to clear it. 
    // If multiple paralyze hits happen, the latest one wins the timer roughly 
    // (requires tracking the timer event to reset it properly, but for MVP simple delayedCall is okay-ish 
    // effectively extending it but multiple delayedCalls might race to clear it early).
    // Better: use a property to track "paralyzedUntil".
    
    // However, to keep it simple as requested:
    // We will just simply add a delayed call. If multiple overlap, the first one to finish will clear it.
    // Extend duration if already paralyzed
    const now = this.scene.time.now;
    const currentExpiry = this.getData('paralyzedUntil') || 0;
    const newEndTime = Math.max(currentExpiry, now + duration);
    
    this.setData('paralyzedUntil', newEndTime);

    // If we were not already effectively paralyzed (or timer expired), start the "update check" or just rely on a delayed call that checks the time.
    this.scene.time.delayedCall(duration, () => {
      if (!this.active || this.isDying) return;
      
      // Check if we should still be paralyzed
      if (this.scene.time.now >= this.getData('paralyzedUntil')) {
        this.cureParalysis();
      }
    });
  }

  protected cureParalysis(): void {
    if (!this.isParalyzed) return;
    
    this.isParalyzed = false;
    this.speed = this.originalSpeed;
    this.clearTint();
    // Re-check direction or movement will happen in next preUpdate
  }

  /**
   * Override updateVisuals to stop animation when paralyzed if desired, 
   * or current logic (moveTowardTarget checks velocity) works.
   * But moveTowardTarget uses `this.scene.physics.moveToObject(this, this.target, this.speed);`
   * Since speed is 0, velocity will be 0.
   */

  /**
   * Flash white tint for 100ms to indicate damage.
   */
  protected flashHit(): void {
    this.setTintFill(0xffffff); // Solid white flash

    this.scene.time.delayedCall(100, () => {
      if (this.active && !this.isDying) {
        if (this.isParalyzed) {
          this.clearTint(); // Clear the Fill
          this.setTint(0xFFFF00); // Restore paralysis yellow
        } else {
          this.clearTint();
        }
      }
    });
  }

  /**
   * Handle enemy death: play fade-out tween, emit event, return to pool.
   */
  protected die(): void {
    if (this.isDying) return;
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
  /**
   * Show "CRIT!" floating text.
   */
  private showCritText(): void {
    const text = this.scene.add.text(this.x, this.y - 30, 'CRIT!', {
      fontSize: '24px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold'
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(20); // Above everything

    // Float up and fade out
    this.scene.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }
}
