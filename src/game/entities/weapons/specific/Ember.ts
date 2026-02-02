import Phaser from 'phaser';
import type { CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';
import { Fireball } from '@/game/entities/projectiles/Fireball';

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
): Phaser.Physics.Arcade.Sprite | null {
  const enemies = getEnemies(scene);
  if (!enemies) return null;

  const activeEnemies = enemies.getChildren().filter(e => e.active) as Phaser.Physics.Arcade.Sprite[];
  if (activeEnemies.length === 0) return null;

  return scene.physics.closest(player, activeEnemies) as Phaser.Physics.Arcade.Sprite | null;
}


export class Ember extends Weapon {
  id = 'ember';
  name = 'Ember (火花)';
  description = 'Fires small fireballs';
  cooldownMs = 1200; // Base cooldown
  
  evolution = undefined;
  evolutionLevel = 8;

  getStats(level: number): { damage: number; count: number; pierce: number; speed: number; cooldown: number } {
    const stats = {
      damage: 10,
      count: 1,
      pierce: 0,
      speed: 400,
      cooldown: 1200
    };

    if (level >= 2) stats.damage = 15;
    if (level >= 3) stats.count = 2; // Spread
    if (level >= 4) stats.pierce = 1;
    if (level >= 5) stats.damage = 20;
    if (level >= 6) stats.count = 3;
    if (level >= 7) stats.pierce = 2;
    if (level >= 8) stats.cooldown = 1000;

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
    
    // Spread Logic
    const angleStep = Phaser.Math.DegToRad(15);
    const totalSpread = (stats.count - 1) * angleStep;
    const startAngle = baseAngle - (totalSpread / 2);

    for (let i = 0; i < stats.count; i++) {
        const currentAngle = startAngle + (i * angleStep);
        
        // Create fireball
        const fireball = new Fireball(scene, player.x, player.y);
        projectilesGroup.add(fireball);

        // Calculate final damage (variance per shot)
        const finalDamage = this.getCalculatedDamage(stats.damage, player);

        // Apply stats
        fireball.setDamage(finalDamage);
        fireball.setPierce(stats.pierce);
        // fireball.setProjectileTint(0xFF4500); // Removed tint to show natural sprite colors
        // fireball.setScale(1.0); // Allow Fireball default scale (0.2) or override here. Default is 0.2. Let's stick to default.
        
        // Randomize speed slightly (0.9x to 1.1x)
        const speedVariance = Phaser.Math.FloatBetween(0.9, 1.1);
        fireball.setSpeed(stats.speed * speedVariance);

        // Set velocity manually
        fireball.setVelocity(
            Math.cos(currentAngle) * stats.speed * speedVariance, 
            Math.sin(currentAngle) * stats.speed * speedVariance
        );
        fireball.setRotation(currentAngle);
        
        // Cleanup
        scene.time.delayedCall(2000, () => {
            if (fireball.active) fireball.destroy();
        });
    }
  }
}
