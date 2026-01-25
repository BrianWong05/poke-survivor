import Phaser from 'phaser';

export class WaterShot extends Phaser.Physics.Arcade.Sprite {
  private damageAmount = 8;
  private knockbackForce = 300;
  private pierce = 1;
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, isHydroPump: boolean = false) {
    super(scene, x, y, 'projectile-water'); // Using 'projectile-water' key, key generation handled below/elsewhere or fallback

    // Generate texture if it doesn't exist
    if (!scene.textures.exists('projectile-water')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff); // White so we can tint it
        graphics.fillCircle(8, 8, 8); // 16x16 circle
        graphics.generateTexture('projectile-water', 16, 16);
    }

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visuals
    this.setTexture('projectile-water');
    this.setTint(0x00BFFF); // Deep Sky Blue

    if (isHydroPump) {
        this.setScale(3.0);
        this.damageAmount = 25;
        this.knockbackForce = 800;
        this.pierce = 999;
    } else {
        this.setScale(1.0);
        this.damageAmount = 8;
        this.knockbackForce = 300;
        this.pierce = 1;
    }
    
    this.setDepth(100);

    // Physics Body
    const radius = 8 * this.scale;
    this.setBodySize(radius * 2, radius * 2);
    this.setCircle(radius);
  }

  setDamage(amount: number): this {
    this.damageAmount = amount;
    return this;
  }

  setKnockback(force: number): this {
    this.knockbackForce = force;
    return this;
  }

  setPierce(count: number): this {
    this.pierce = count;
    return this;
  }

  /**
   * Called when this projectile hits an enemy.
   */
  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;

    // Apply damage
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount);

    // Track hit
    this.hitEnemies.push(enemy);

    // Apply Knockback
    if (enemy.body) {
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
        
        // Calculate vector from projectile to enemy
        const knockbackVector = new Phaser.Math.Vector2(enemy.x - this.x, enemy.y - this.y).normalize();
        
        // Apply force (add to current velocity)
        // We add to velocity to "push" them, regardless of their mass (unless mass is huge)
        // To ensure it feels impactful, we might want to set velocity or add significantly.
        // Adding allows them to fight back a bit, Setting overrides movement completely.
        // Spec says: "Apply this velocity to the enemy.body.velocity". implies adding or setting.
        // Usually for knockback, adding an impulse is better.
        enemyBody.velocity.x += knockbackVector.x * this.knockbackForce;
        enemyBody.velocity.y += knockbackVector.y * this.knockbackForce;

        // Disable AI movement to allow physics knockback to take effect
        // Duration roughly based on drag (500) decay: t = v/a
        const duration = (this.knockbackForce / 500) * 1000;
        enemy.setData('knockbackUntil', this.scene.time.now + duration);
    }

    // Handle Pierce
    this.pierce--;
    
    if (this.pierce < 0) {
        this.destroy();
    }
  }
}
