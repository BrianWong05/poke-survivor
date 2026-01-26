

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  private damageAmount = 10;
  private pierceCount = 0;
  private speed = 400;
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-fireball'); // Placeholder key, will use circle if texture missing

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visuals (Red circle)
    this.setTint(0xFF4500); 
    this.setScale(1); 
    this.setDepth(100);

    // Physics
    this.setBodySize(16, 16);
    this.setCircle(8);
  }

  fireAt(targetX: number, targetY: number): void {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
      this.setRotation(angle);
  }

  setDamage(amount: number): this {
    this.damageAmount = amount;
    this.setData('damage', amount);
    return this;
  }

  setPierce(count: number): this {
    this.pierceCount = count;
    return this;
  }

  setProjectileTint(color: number): this {
    this.setTint(color);
    return this;
  }
  
  setSpeed(speed: number): this {
      this.speed = speed;
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

    // Track hit
    this.hitEnemies.push(enemy);



    // Pierce Logic
    if (this.pierceCount > 0) {
      this.pierceCount--;
      // Continue flying
    } else {
        // Destroy
        this.destroy();
        // Optional: Spawn ash particle
    }
  }


}
