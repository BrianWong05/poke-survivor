import Phaser from 'phaser';
import type { Enemy } from '@/game/entities/enemies/Enemy';

export class Shockwave extends Phaser.Physics.Arcade.Sprite {
  private damageAmount = 20;
  private knockbackForce = 500;
  private stunDurationMs = 0;
  private hitEnemies: Set<Phaser.GameObjects.GameObject> = new Set();
  
  // Track visual radius for debug or logic if needed, though we rely on body size.
  // We'll scale the sprite, and since the body is circular and matches sprite size (usually), 
  // physics overlap will handle the growing radius.

  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    targetScale: number,
    damage: number,
    knockback: number,
    stunDurationMs: number = 0,
    tint: number = 0xffffff
  ) {
    super(scene, x, y, 'projectile-shockwave');

    // Generate texture if it doesn't exist
    if (!scene.textures.exists('projectile-shockwave')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.lineStyle(4, 0xffffff); 
        graphics.strokeCircle(64, 64, 60); // Base radius 60 (128x128 texture)
        graphics.generateTexture('projectile-shockwave', 128, 128);
    }

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set stats
    this.damageAmount = damage;
    this.knockbackForce = knockback;
    this.stunDurationMs = stunDurationMs;

    // Visuals
    this.setTexture('projectile-shockwave');
    this.setTint(tint);
    this.setAlpha(1);
    this.setScale(0.1); // Start small
    this.setDepth(90); // Below projectiles/player but above some ground items

    // Physics Body
    // We need the body to grow with the sprite. 
    // Phaser Arcade Physics bodies don't automatically scale with sprite scale unless we update them.
    // However, setCircle sets the radius. We'll update body size in preUpdate or rely on a tween update callback.
    this.setCircle(60); // Match texture radius

    // Animate
    scene.tweens.add({
        targets: this,
        scale: targetScale,
        alpha: 0,
        duration: 300,
        ease: 'Quad.out',
        onUpdate: () => {
            // Update body size/radius to match new scale
            // Ideally we'd just want the physics body to scale. 
            // setScale on sprite affects body if we don't manually set body size? 
            // Actually in Arcade physics, you often need to sync body.
            if (this.body) {
                // Determine new radius based on scale
                const newRadius = 60 * this.scale;
                this.setBodySize(newRadius * 2, newRadius * 2);
                this.setCircle(newRadius);
                // Re-center body? setCircle usually handles offset if done right, but let's ensure it's centered.
                // Circle body defaults to top-left origin if not careful.
                // Phaser sprites are center origin (0.5).
                // setCircle(radius, offsetX, offsetY).
                // We want center of body to be at x,y.
                // If body is size R*2, centered on sprite.
                // Actually, simply scaling the sprite usually scales the body IF we haven't manually set a fixed size.
                // Let's rely on standard sprite scaling first, if that fails we add update logic.
                // Update: Arcade Body does NOT automatically scale with Sprite in all versions. 
                // Safest to NOT manual update here unless we verify it's broken.
                // But generally `body.updateFromGameObject()` might be needed?
                // Let's try explicit body update in onUpdate.
                
                // Keep body centered?
                // For now, let's assume the overlap check works on the growing sprite. 
                // We will test this.
            }
        },
        onComplete: () => {
            this.destroy();
        }
    });
  }



  // Redefining onHit to actually do the logic
  // Renaming to 'handleOverlap' to avoid confusion if we want a stricter naming
  public handleOverlap(enemy: Phaser.GameObjects.GameObject): void {
      const enemySprite = enemy as Enemy;
      // Safety check
      if (!enemySprite.active || enemySprite.isDying) return;
      
      // Check if already hit
      // We rely on object reference equality for the Set.
      // JS Set works with object references.
      // But my field type definition needs to match.
      // I'll update the field type to `Set<Phaser.GameObjects.GameObject>`.
      if (this.hitEnemies.has(enemySprite)) return;

      this.hitEnemies.add(enemySprite);

      // Apply effects
      this.applyDamage(enemySprite);
      this.applyKnockback(enemySprite);
      if (this.stunDurationMs > 0) {
          this.applyStun(enemySprite);
      }
  }

  private applyDamage(enemy: Enemy) {
      this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
  }

  private applyKnockback(enemy: Enemy) {
      if (enemy.body) {
          const body = enemy.body as Phaser.Physics.Arcade.Body;
          // Vector from shockwave center to enemy
          const vec = new Phaser.Math.Vector2(enemy.x - this.x, enemy.y - this.y).normalize();
          
          body.velocity.x += vec.x * this.knockbackForce;
          body.velocity.y += vec.y * this.knockbackForce;
          
          // Disable AI movement for a bit (knockback duration)
          const duration = (this.knockbackForce / 500) * 1000;
          
          // Use the longer of stun or knockback for movement disable
          // But stun is separate 'stopped' state. 
          // If we have stun, we overwrite this below.
          enemy.setData('knockbackUntil', this.scene.time.now + duration);
      }
  }

  private applyStun(enemy: Enemy) {
      // Overwrite knockback finish time with stun time if stun is longer
      // Stun effectively means "cannot move".
      // knockbackUntil prevents movement logic in Enemy.ts.
      const currentBlock = enemy.getData('knockbackUntil') || 0;
      const stunEnd = this.scene.time.now + this.stunDurationMs;
      
      if (stunEnd > currentBlock) {
          enemy.setData('knockbackUntil', stunEnd);
      }
      
      // Visual feedback for stun? (Optional but nice)
      // enemy.setTint(0x800080); // Maybe? But we shouldn't mess with enemy visuals too much here without cleanup.
  }
}
