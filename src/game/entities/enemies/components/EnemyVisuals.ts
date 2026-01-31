import Phaser from 'phaser';
import { type Enemy } from '../Enemy';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';

export class EnemyVisuals {
  private enemy: Enemy;
  private scene: Phaser.Scene;
  private currentDirection: DirectionName = 'down';

  constructor(enemy: Enemy) {
    this.enemy = enemy;
    this.scene = enemy.scene;
  }

  public init(startDirection: DirectionName = 'down'): void {
      this.currentDirection = startDirection;
  }

  public update(): void {
    if (!this.enemy.body) return;

    // Skip visual updates if paralyzed? (Logic from original was implicitly checking velocity via moveTowardTarget but updateVisuals had its own check)
    // Original updateVisuals:
    // const velocity = (this.body as Phaser.Physics.Arcade.Body).velocity;
    // const isMoving = velocity.x !== 0 || velocity.y !== 0;
    // ...

    const body = this.enemy.body as Phaser.Physics.Arcade.Body;
    const velocity = body.velocity;
    const isMoving = velocity.x !== 0 || velocity.y !== 0;

    if (isMoving) {
      // Try 8-way animation
      const newDirection = getDirectionFromVelocity(velocity.x, velocity.y);
      const animKey = `${this.enemy.texture.key}-${newDirection}`;

      if (this.scene.anims.exists(animKey)) {
        // Only update if direction changed or not playing
        if (newDirection !== this.currentDirection || !this.enemy.anims.isPlaying) {
          this.currentDirection = newDirection;
          this.enemy.play(animKey, true);
          // Also update data for potential debug usage
          this.enemy.setData('currentDirection', newDirection);
        }
        this.enemy.setFlipX(false); // Ensure no legacy flip
        return;
      }
    }

    // Fallback: legacy flip
    this.updateFlip(velocity);
  }

  private updateFlip(velocity: Phaser.Math.Vector2): void {
    if (velocity.x < 0) {
      this.enemy.setFlipX(true);
    } else if (velocity.x > 0) {
      this.enemy.setFlipX(false);
    }
  }

  public flashHit(isParalyzed: boolean): void {
    this.enemy.setTintFill(0xffffff);
    
    this.scene.time.delayedCall(100, () => {
      if (this.enemy.active && !this.enemy.isDying) {
        if (isParalyzed) {
           this.enemy.setTint(0xFFFF00);
        } else {
           this.enemy.clearTint();
        }
      }
    });
  }

  public showCritText(): void {
    const text = this.scene.add.text(this.enemy.x, this.enemy.y - 30, 'CRIT!', {
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

  public playDeathTween(onComplete: () => void): void {
    this.scene.tweens.add({
      targets: this.enemy,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: onComplete,
    });
  }
  
  public playDonutSquash(): void {
      const currentScale = 1.5; // We assume 1.5 is base scale from Enemy.ts constructor
      // Ideally we should read this.enemy.scaleX but it might be mid-tween.
      // For now hardcoding 1.5 is fine or using enemy.scaleX
      
      this.scene.tweens.add({
        targets: this.enemy,
        scaleX: currentScale * 0.8,
        scaleY: currentScale * 1.2,
        duration: 50,
        yoyo: true,
        ease: 'Power2'
      });
  }
}
