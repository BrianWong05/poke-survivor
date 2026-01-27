import Phaser from 'phaser';

export class AuraSphereProjectile extends Phaser.Physics.Arcade.Sprite {
  public damageAmount = 12;
  public knockbackForce = 50; 
  public pierce = 1;
  public speed = 400; // Default, can be overridden
  public turnSpeed = 180; // Degrees per second
  
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];
  
  // Damage Falloff
  private damageFalloff = 0.75; // 25% reduction (multiply by 0.75)

  // Homing Logic
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private findTargetInterval = 200; // ms
  private lastTargetSearch = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-aura-sphere');

    // Generate texture if needed
    if (!scene.textures.exists('projectile-aura-sphere')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0x00BFFF); // Blue Circle
        graphics.fillCircle(10, 10, 10); // 20x20
        graphics.generateTexture('projectile-aura-sphere', 20, 20);
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setTexture('projectile-aura-sphere');
    this.setTint(0x00BFFF); 

    this.setDepth(100);
    
    // Physics Body
    const radius = 10;
    this.setBodySize(radius * 2, radius * 2);
    this.setCircle(radius);
  }

  public setup(stats: { damage: number; speed: number; turnRate: number; pierce: number }) {
      this.damageAmount = stats.damage;
      this.speed = stats.speed;
      this.turnSpeed = stats.turnRate;
      this.pierce = stats.pierce;
  }

  public setTarget(target: Phaser.Physics.Arcade.Sprite | null): void {
    this.target = target;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    // If target is missing or dead, try to find a new one periodically
    if ((!this.target || !this.target.active || (this.target as any).isDying) && time > this.lastTargetSearch + this.findTargetInterval) {
        this.lastTargetSearch = time;
        this.findNewTarget();
    }

    if (this.target && this.target.active && !(this.target as any).isDying && this.body) {
      // Homing Logic
      const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
      
      // Current velocity angle
      const body = this.body as Phaser.Physics.Arcade.Body;
      const currentAngle = body.velocity.angle();

      // Lerp angle towards target
      // Use RotateTo for constant turn rate
      const turnRateRad = Phaser.Math.DegToRad(this.turnSpeed);
      let newAngle = Phaser.Math.Angle.RotateTo(currentAngle, targetAngle, turnRateRad * (delta / 1000));
      
      // Update velocity
      this.scene.physics.velocityFromRotation(newAngle, this.speed, body.velocity);
      this.setRotation(newAngle);
    } else if (this.body) {
       // Just keep moving in current direction if target lost
       const body = this.body as Phaser.Physics.Arcade.Body;
       this.scene.physics.velocityFromRotation(this.rotation, this.speed, body.velocity);
    }
  }

  private findNewTarget(): void {
      const enemies = this.scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
      if (!enemies) return;

      const activeEnemies = enemies.getChildren().filter(e => e.active && !(e as any).isDying);
      if (activeEnemies.length === 0) {
          this.target = null;
          return;
      }

      this.target = this.scene.physics.closest(this, activeEnemies) as Phaser.Physics.Arcade.Sprite | null;
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;
    
    // Apply damage
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
    
    this.hitEnemies.push(enemy);

    // Apply Knockback
    if (enemy.body) {
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
        const knockbackVector = new Phaser.Math.Vector2(enemy.x - this.x, enemy.y - this.y).normalize();
        enemyBody.velocity.x += knockbackVector.x * this.knockbackForce;
        enemyBody.velocity.y += knockbackVector.y * this.knockbackForce;
        
        enemy.setData('knockbackUntil', this.scene.time.now + 100);
    }

    // Damage Falloff for next hit
    this.damageAmount = Math.max(1, Math.floor(this.damageAmount * this.damageFalloff));

    this.pierce--;
    if (this.pierce < 0) {
        this.destroy();
    }
  }
}
