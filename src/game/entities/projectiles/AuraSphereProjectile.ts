import Phaser from 'phaser';

export class AuraSphereProjectile extends Phaser.Physics.Arcade.Sprite {
  public damageAmount = 12;
  public knockbackForce = 100; // Standard knockback
  public pierce = 1;
  public speed = 400;
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];
  
  // Homing Logic
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private turnSpeed = 200; // Degrees per second rotation towards target (approx)

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-aura-sphere');

    // Generate texture if needed
    if (!scene.textures.exists('projectile-aura-sphere')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(10, 10, 10); // 20x20
        graphics.generateTexture('projectile-aura-sphere', 20, 20);
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setTexture('projectile-aura-sphere');
    this.setTint(0x00BFFF); // Blue Circle

    this.setDepth(100);
    
    // Physics Body
    const radius = 10;
    this.setBodySize(radius * 2, radius * 2);
    this.setCircle(radius);
  }

  public setTarget(target: Phaser.Physics.Arcade.Sprite | null): void {
    this.target = target;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (this.target && this.target.active && this.body) {
      // Homing Logic
      const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
      
      // Current velocity angle
      const body = this.body as Phaser.Physics.Arcade.Body;
      const currentAngle = body.velocity.angle();

      // Lerp angle towards target (simple homing)
      // We can use RotateTo for smooth turning
      // Ideally we adjust velocity vector
      
      let newAngle = Phaser.Math.Angle.RotateTo(currentAngle, targetAngle, (this.turnSpeed * Math.PI / 180) * (delta / 1000));
      
      // Update velocity
      this.scene.physics.velocityFromRotation(newAngle, this.speed, body.velocity);
      this.setRotation(newAngle);
    } else if (this.body) {
       // Just keep moving in current direction if target lost
       const body = this.body as Phaser.Physics.Arcade.Body;
       this.setRotation(body.velocity.angle());
    }
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;

    // Apply damage
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
    
    this.hitEnemies.push(enemy);

    // Apply Knockback (Small)
    if (enemy.body) {
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
        const knockbackVector = new Phaser.Math.Vector2(enemy.x - this.x, enemy.y - this.y).normalize();
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
