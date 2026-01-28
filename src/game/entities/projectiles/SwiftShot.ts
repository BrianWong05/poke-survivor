import Phaser from 'phaser';

export class SwiftShot extends Phaser.Physics.Arcade.Sprite {
  public damageAmount = 10;
  public knockbackForce = 100;
  public pierce = 1;

  private hitEnemies: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-swift');

    // Generate Star Texture if it doesn't exist
    if (!scene.textures.exists('projectile-swift')) {
      const graphics = scene.make.graphics({ x: 0, y: 0 });
      
      // Draw a Star
      graphics.fillStyle(0xFFD700, 1.0); // Gold
      graphics.lineStyle(2, 0xFFFFFF, 1.0); // White edge
      
      const points = 5;
      const outerRadius = 16;
      const innerRadius = 8;
      const step = Math.PI / points;
      
      graphics.beginPath();
      for (let i = 0; i < 2 * points; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const a = i * step - Math.PI / 2; // Start internal pointing up
        const px = 16 + Math.cos(a) * r; // Center at 16,16
        const py = 16 + Math.sin(a) * r;
        
        if (i === 0) graphics.moveTo(px, py);
        else graphics.lineTo(px, py);
      }
      graphics.closePath();
      graphics.fillPath();
      graphics.strokePath();

      graphics.generateTexture('projectile-swift', 32, 32);
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setTexture('projectile-swift');
    this.setTint(0xFFD700); // Ensure gold tint
    
    // Physics Body
    // Keep it slightly smaller than the visual star
    this.setBodySize(24, 24);
    this.setCircle(12);
  }

  public setup(stats: { damage: number; speed: number; pierce: number; velocity: Phaser.Math.Vector2 }) {
    this.damageAmount = stats.damage;
    this.pierce = stats.pierce;
    
    if (this.body) {
        this.body.velocity.copy(stats.velocity);
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    
    // Visual Spin
    this.angle += 15;

    // Out of bounds check
    if (this.scene && this.scene.cameras.main) {
        const cam = this.scene.cameras.main;
        const bounds = 100;
        if (
            this.x < cam.scrollX - bounds || 
            this.x > cam.scrollX + cam.width + bounds ||
            this.y < cam.scrollY - bounds ||
            this.y > cam.scrollY + cam.height + bounds
        ) {
            this.destroy();
        }
    }
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;
    
    // Apply damage
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
    
    this.hitEnemies.push(enemy);

    // Apply Knockback
    // Knockback in the direction of the projectile's movement
    if (enemy.body && this.body) {
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
        const myBody = this.body as Phaser.Physics.Arcade.Body;
        
        const knockbackVector = myBody.velocity.clone().normalize();
        
        enemyBody.velocity.x += knockbackVector.x * this.knockbackForce;
        enemyBody.velocity.y += knockbackVector.y * this.knockbackForce;
        
        enemy.setData('knockbackUntil', this.scene.time.now + 100);
    }

    this.pierce--;
    if (this.pierce < 0) {
        this.destroy();
    }
  }
}
