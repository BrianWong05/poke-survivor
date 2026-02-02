import Phaser from 'phaser';
import type { CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';
import { Enemy } from '@/game/entities/enemies/Enemy';

/**
 * Helper to get the enemies group from scene registry
 */
function getEnemies(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group | null;
}

/**
 * Helper to get the projectiles group from scene registry
 */
function getProjectiles(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group | null;
}

/**
 * Find the nearest active enemy to the player
 */
function findNearestEnemy(
  scene: Phaser.Scene,
  player: Phaser.Physics.Arcade.Sprite
): Enemy | null {
  const enemies = getEnemies(scene);
  if (!enemies) return null;

  const activeEnemies = enemies.getChildren().filter(e => e.active) as Enemy[];
  if (activeEnemies.length === 0) return null;

  return scene.physics.closest(player, activeEnemies) as Enemy | null;
}

export class WaterPulseShot extends Phaser.Physics.Arcade.Sprite {
  private damageAmount = 4;
  private knockbackForce = 200;
  private pierceCount = 0;
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];
  private hitList: Set<string> = new Set();
  private speed = 700;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const textureKey = 'projectile-water-pulse-gen-v2';
    if (!scene.textures.exists(textureKey)) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        
        // Center Core
        graphics.fillStyle(0x00FFFF, 0.8);
        graphics.fillCircle(16, 16, 6);

        // Inner Ring
        graphics.lineStyle(2, 0x00FFFF, 1.0);
        graphics.strokeCircle(16, 16, 10);

        // Outer Ring
        graphics.lineStyle(2, 0x0088FF, 0.6);
        graphics.strokeCircle(16, 16, 14);

        graphics.generateTexture(textureKey, 32, 32);
        graphics.destroy();
    }

    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visuals
    this.clearTint(); // Use generated color
    this.setScale(0.8, 1.0); // Start smaller for extreme breathing range
    this.setDepth(100);

    // Physics
    this.setCircle(10, 6, 6); // Radius 10, Offset (6,6) to center in 32x32 frame 

    // Animation: Pulsing Effect (Extreme Breathing)
    this.scene.tweens.add({
        targets: this,
        scaleX: { from: 0.8, to: 1.8 },  // Extreme range: 0.8 -> 1.8
        scaleY: { from: 1.0, to: 2.2 },  // Extreme range: 1.0 -> 2.2 (Maintains oval ratio)
        alpha: { from: 1.0, to: 0.6 },   // deeper alpha pulse
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
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
    this.setData('pierceCount', count);
    return this;
  }

  setKnockback(force: number): this {
    this.knockbackForce = force;
    return this;
  }
  
  setSpeed(speed: number): this {
      this.speed = speed;
      return this;
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    const uid = enemy.getData('uid') as string;
    
    // Safety check for destroyed/inactive enemies
    if (!enemy.active) return;

    if (uid) {
        if (this.hitList.has(uid)) return;
        this.hitList.add(uid);
    } else {
        if (this.hitEnemies.includes(enemy)) return;
        this.hitEnemies.push(enemy);
    }

    // Step 2: Calculate & Apply Knockback using ROTATION (Stable)
    const forceVector = this.scene.physics.velocityFromRotation(this.rotation, this.knockbackForce);
    
    if (typeof (enemy as any).applyKnockback === 'function') {
        (enemy as any).applyKnockback(forceVector, 200);
    }

    // Step 3: Deal Damage
    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
        (enemy as any).takeDamage(this.damageAmount);
    } else {
        this.scene.events.emit('damage-enemy', enemy, this.damageAmount);
    }
    
    // Ensure projectile remains visible during pass-through
    this.setVisible(true);
    this.setAlpha(1);

    // Step 4: Handle Pierce
    this.pierceCount--;
    if (this.pierceCount < 0) {
        this.destroy();
    }
  }
}

export class WaterPulse extends Weapon {
  id = 'water-pulse';
  name = 'Water Pulse (水之波動)';
  description = 'High speed pulses of water.';
  cooldownMs = 400; 

  getStats(level: number): { damage: number; count: number; pierce: number; speed: number; cooldown: number; knockback: number } {
    const stats = {
      damage: 4,
      count: 1,
      pierce: 0,
      speed: 700,
      cooldown: 400,
      knockback: 200
    };

    if (level >= 2) stats.damage += 2; 
    if (level >= 3) stats.cooldown -= 50; 
    if (level >= 4) stats.pierce += 1; 
    if (level >= 5) stats.damage += 2; 
    if (level >= 6) stats.cooldown -= 50; 
    if (level >= 7) stats.pierce += 1; 
    if (level >= 8) stats.cooldown = 200; 

    return stats;
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    const stats = this.getStats(level);

    // Calculate base angle
    const baseAngle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    
    // Spread Logic (Matches Ember)
    const finalCount = this.getFinalProjectileCount(stats.count, player);

    // Spread Logic (Matches Ember)
    const angleStep = Phaser.Math.DegToRad(15);
    const totalSpread = (finalCount - 1) * angleStep;
    const startAngle = baseAngle - (totalSpread / 2);

    for (let i = 0; i < finalCount; i++) {
        const currentAngle = startAngle + (i * angleStep);
        
        const projectile = new WaterPulseShot(scene, player.x, player.y);
        
        // Use standard damage calculation
        const finalDamage = this.getCalculatedDamage(stats.damage, player);

        projectile.setDamage(finalDamage);
        projectile.setPierce(stats.pierce);
        projectile.setKnockback(stats.knockback);
        projectile.setSpeed(stats.speed);

        // Add to group AFTER setting stats to prevent early collision with default values
        projectilesGroup.add(projectile);

        // Fire at specific angle
        projectile.setVelocity(
            Math.cos(currentAngle) * stats.speed, 
            Math.sin(currentAngle) * stats.speed
        );
        projectile.setRotation(currentAngle);

        // Cleanup
        scene.time.delayedCall(3000, () => {
          if (projectile.active) projectile.destroy();
        });
    }
  }
}
