import Phaser from 'phaser';

export class BoneProjectile extends Phaser.Physics.Arcade.Sprite {
  // Config
  private damageAmount = 30; // High contact damage
  private knockbackForce = 500; // High Knockback

  // Orbiting bones persist. Hit enemies should take damage again after cooldown or just once?
  // "Damage: High contact damage" usually implies continuous or interval damage if they stay in range.
  // But standard projectiles destroy/pierce.
  // Since these orbit for 8s, they should probably hit multiple enemies.
  // And probably hit the SAME enemy multiple times if it stays? Or usually "invincibility frames" for enemy.
  // For simplicity: Hit once per enemy? No, then they become useless quickly.
  // Hit same enemy periodically?
  // Let's implement a simple "cooldown" map.
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
    this.setBodySize(30, 30); // Generous hitbox
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    
    if (!this.player || !this.player.active) {
        this.destroy();
        return;
    }

    // Orbit Logic
    // Angle increases over time
    this.orbitAngle += delta * 0.005; 

    // Radius expands/contracts
    // time is ms. sin expects radians.
    // period approx 2-3s?
    const t = time * 0.003; 
    const radius = 100 + Math.sin(t) * 50;

    this.setPosition(
        this.player.x + Math.cos(this.orbitAngle) * radius,
        this.player.y + Math.sin(this.orbitAngle) * radius
    );
    
    // Rotate to face trajectory or just spin?
    // "Bone Rush" usually spins the bone itself.
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
    // We can emit event or direct call. Direct call is safer for new Enemy class.
     if ('takeDamage' in enemy) {
        (enemy as any).takeDamage(this.damageAmount);
    } else {
         this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
    }

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
