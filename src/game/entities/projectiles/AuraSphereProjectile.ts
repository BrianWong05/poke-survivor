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

    // Generate complex texture
    if (!scene.textures.exists('projectile-aura-sphere')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        
        // 1. Outer Halo (Faint Blue, Soft)
        // 64x64 texture, radius 32
        graphics.fillStyle(0x00BFFF, 0.2);
        graphics.fillCircle(32, 32, 32); 

        // 2. Inner Glow/Body (Cyan-Blue, defined)
        graphics.fillStyle(0x00BFFF, 0.8);
        graphics.fillCircle(32, 32, 24);

        // 3. Energy Swirls (Lighter Cyan arcs)
        graphics.lineStyle(3, 0x80FFFF, 0.9);
        graphics.beginPath();
        // Swirl 1
        graphics.arc(32, 32, 18, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(120), false);
        graphics.strokePath();

         // Swirl 2
        graphics.beginPath();
        graphics.arc(32, 32, 20, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(300), false);
        graphics.strokePath();

        // 4. Core (White/Bright Cyan, solid)
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillCircle(32, 32, 10);
        
        // Blue tint on core edge
        graphics.lineStyle(2, 0xAAFFFF, 1);
        graphics.strokeCircle(32, 32, 10);

        graphics.generateTexture('projectile-aura-sphere', 64, 64);
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setTexture('projectile-aura-sphere');
    // Removed setTint to preserve multi-color texture
    
    // Scale down a bit since texture is 64x64, we want visual size ~30-40
    this.setScale(0.6); 

    this.setDepth(100);
    
    // Physics Body
    const radius = 16; // 32 * 0.6 ~= 19, let's keep hitbox slightly smaller than visual
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

  private trailTimer = 0;

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    
    // Visual Animation: Pulse
    // Sine wave pulse between 0.55 and 0.65 scale
    const pulseSpeed = 0.005;
    this.setScale(0.6 + Math.sin(time * pulseSpeed) * 0.05);

    // Visual Animation: Rotation (Swirl)
    // Rotate the sprite visual itself 
    this.angle += 15; // Fast spin

    // Trail Effect
    this.trailTimer += delta;
    if (this.trailTimer > 50) { // Every 50ms
        this.trailTimer = 0;
        this.spawnTrailParticle();
    }

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
      
      // Note: We do NOT set this.setRotation(newAngle) for the sprite visual anymore 
      // because we are spinning it for effect. Physics body rotation doesn't matter for circles.
    } else if (this.body) {
       // Just keep moving in current direction if target lost
       const body = this.body as Phaser.Physics.Arcade.Body;
       this.scene.physics.velocityFromRotation(body.velocity.angle(), this.speed, body.velocity);
    }
  }

  private spawnTrailParticle() {
      // Create a fading ghost
      const particle = this.scene.add.sprite(this.x, this.y, 'projectile-aura-sphere');
      particle.setScale(this.scale * 0.8);
      particle.setAlpha(0.4);
      particle.setDepth(this.depth - 1);
      
      this.scene.tweens.add({
          targets: particle,
          alpha: 0,
          scale: 0,
          duration: 150, // Shortened from 300ms
          onComplete: () => particle.destroy()
      });
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
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount, true);
    
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
