import Phaser from 'phaser';

export class BoneProjectile extends Phaser.Physics.Arcade.Sprite {
  // Config
  private damageAmount = 30; // Default, can be overridden
  private knockbackForce = 500; 

  // Hit Cooldown Map
  private hitCooldowns: Map<Phaser.GameObjects.GameObject, number> = new Map();
  private HIT_COOLDOWN = 500; // 0.5s cooldown per enemy
  
  // Orbit
  public player: Phaser.Physics.Arcade.Sprite;
  public orbitAngle: number;

  constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite, startAngle: number) {
    super(scene, player.x, player.y, 'projectile-bone');
    this.player = player;
    this.orbitAngle = startAngle;

    // Visuals
    if (!scene.textures.exists('projectile-bone')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xE0E0E0); // Bone White
        graphics.fillRect(0, 0, 30, 8); // Long bone shape
        graphics.generateTexture('projectile-bone', 30, 8);
    }
    this.setTexture('projectile-bone');
    this.setDepth(105);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics
    this.setBodySize(30, 30); 
  }

  setDamage(amount: number) {
      this.damageAmount = amount;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.scene.time.paused) return;
    
    if (!this.player || !this.player.active) {
        this.destroy();
        return;
    }

    // Orbit Logic
    this.orbitAngle += delta * 0.005; 

    // Radius expands/contracts
    const t = time * 0.003; 
    const radius = 100 + Math.sin(t) * 50;

    this.setPosition(
        this.player.x + Math.cos(this.orbitAngle) * radius,
        this.player.y + Math.sin(this.orbitAngle) * radius
    );
    
    this.rotation += delta * 0.01;

    // Cleanup cooldowns
    const now = this.scene.time.now;
    for (const [enemy, timestamp] of this.hitCooldowns) {
        if (now > timestamp + this.HIT_COOLDOWN) {
            this.hitCooldowns.delete(enemy);
        }
    }
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Check cooldown
    if (this.hitCooldowns.has(enemy)) return;

    // Apply Damage
    // Emit isFinal=true
    this.scene.events.emit('damage-enemy', enemy, this.damageAmount, true);

    // Apply Knockback
    if (enemy.body) {
         const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
         const knockbackVector = new Phaser.Math.Vector2(enemy.x - this.player.x, enemy.y - this.player.y).normalize();
         enemyBody.velocity.x += knockbackVector.x * this.knockbackForce;
         enemyBody.velocity.y += knockbackVector.y * this.knockbackForce;
         enemy.setData('knockbackUntil', this.scene.time.now + 200);
    }

    // Set cooldown
    this.hitCooldowns.set(enemy, this.scene.time.now);
  }
}
