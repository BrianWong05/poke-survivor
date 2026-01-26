import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
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

export class Flamethrower implements WeaponConfig {
  id = 'flamethrower';
  name = 'Flamethrower';
  description = 'Rapid fire stream of embers';
  cooldownMs = 150; // Rapid fire

  fire(ctx: CharacterContext): void {
    const { scene, player } = ctx;
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Create fireball
    const fireball = new Fireball(scene, player.x, player.y);
    projectilesGroup.add(fireball);

    // Flamethrower stats
    fireball.setDamage(6);
    fireball.setPierce(3);
    fireball.setProjectileTint(0xFFA500); // Orange
    fireball.setScale(0.8); // Slightly smaller
    
    // Fire at enemy
    fireball.fireAt(nearestEnemy.x, nearestEnemy.y);

    // Cleanup
    scene.time.delayedCall(2000, () => {
      if (fireball.active) fireball.destroy();
    });
  }
}

export class Ember implements WeaponConfig {
  id = 'ember';
  name = 'Ember';
  description = 'Fires small fireballs';
  cooldownMs = 1200; // Base cooldown
  
  evolution = new Flamethrower();
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

        // Apply stats
        fireball.setDamage(stats.damage);
        fireball.setPierce(stats.pierce);
        fireball.setProjectileTint(0xFF4500);
        fireball.setScale(1.0);
        
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
