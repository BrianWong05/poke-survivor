import Phaser from 'phaser';

export class LightningBolt extends Phaser.Physics.Arcade.Sprite {
  private damageAmount = 10;
  private chainCount = 1; // Default 1 bounce
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-lightning');

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visuals
    // Tint already yellow in texture, but kept for brightness or variation if needed
    this.setTint(0xffff00); 
    this.setScale(1.5); 
    this.setDepth(100); 

    // Physics
    // Rectangular body better for long bolt
    this.setBodySize(24, 8);
    this.setOffset(4, 0);
  }

  setDamage(amount: number): this {
    this.damageAmount = amount;
    this.setData('damage', amount);
    return this;
  }

  setChainCount(count: number): this {
    this.chainCount = count;
    return this;
  }

  /**
   * Called when this projectile hits an enemy.
   * @param enemy The enemy that was hit
   */
  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;

    // Apply damage
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount);

    // Track hit enemies to avoid bouncing back to same target immediately (optional, but good)
    this.hitEnemies.push(enemy);

    // 20% Chance to stun
    if (Math.random() < 0.2) {
        // Apply Stun
        enemy.setVelocity(0, 0);
        enemy.setData('stunned', true);
        enemy.setTint(0xffff00); // Visual feedback
        if (this.scene) {
            this.scene.time.delayedCall(500, () => {
                if (enemy.active) {
                    enemy.setData('stunned', false);
                    enemy.clearTint();
                }
            });
        }
    }

    // Chain Logic
    if (this.chainCount > 0) {
        this.chainCount--;
        
        // Find next target
        const enemiesGroup = this.scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
        if (enemiesGroup) {
            // Get all active enemies
            const potentialTargets = enemiesGroup.getChildren().filter(e => {
                const isDying = 'isDying' in e ? (e as any).isDying : false;
                return e.active && 
                       !isDying && // Not dying
                       e !== enemy && // Not the one we just hit
                       !this.hitEnemies.includes(e); // Not one we already hit
            });

            if (potentialTargets.length > 0) {
                // Find closest among them relative to the current enemy position
                const nextTarget = this.scene.physics.closest(enemy, potentialTargets) as Phaser.Physics.Arcade.Sprite | null;
                
                if (nextTarget) {
                    // Range check (e.g. 300px bounce range)
                    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, nextTarget.x, nextTarget.y);
                    if (dist <= 300) {
                        // Bounce!
                        this.setPosition(enemy.x, enemy.y);
                        
                        const angle = Phaser.Math.Angle.Between(this.x, this.y, nextTarget.x, nextTarget.y);
                        const speed = 600; // Keep same speed
                        
                        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                        this.setRotation(angle);
                        
                        // Continue projectile life
                        return;
                    }
                }
            }
        }
    }

    // If no chain or no target found, destroy
    this.destroy();
  }
}
