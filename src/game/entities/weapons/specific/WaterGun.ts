import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { WaterShot } from '@/game/entities/projectiles/WaterShot';

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

  // Filter out enemies that are dying
  const activeEnemies = enemies.getChildren().filter(e => {
    // Check if it's an Enemy instance (has isDying prop)
    if ('isDying' in e) {
      return !(e as any).isDying && e.active;
    }
    return e.active;
  });

  if (activeEnemies.length === 0) return null;

  return scene.physics.closest(player, activeEnemies) as Phaser.Physics.Arcade.Sprite | null;
}

export class HydroPump implements WeaponConfig {
  id = 'hydro-pump';
  name = 'Hydro Pump';
  description = 'Massive high-pressure blast that clears a path.';
  cooldownMs = 1500;

  fire(ctx: CharacterContext): void {
    const { scene, player } = ctx;
    
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Create Hydro Pump projectile (isHydroPump = true)
    const shot = new WaterShot(scene, player.x, player.y, true);
    
    // Add to group for collision management
    projectilesGroup.add(shot);

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = 600; // Fast slug
    
    shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    shot.setRotation(angle);

    // Fail-safe cleanup
    scene.time.delayedCall(3000, () => {
        if (shot.active) shot.destroy();
    });
  }
}

export class WaterGun implements WeaponConfig {
  id = 'water-gun';
  name = 'Water Gun';
  description = 'Shoots water that pushes enemies back.';
  cooldownMs = 900;
  
  // Evolution link
  evolution = new HydroPump();
  evolutionLevel = 8;

  fire(ctx: CharacterContext): void {
    const { scene, player } = ctx;
    
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Create Water Gun projectile (isHydroPump = false)
    const shot = new WaterShot(scene, player.x, player.y, false);
    
    // Add to group for collision management
    projectilesGroup.add(shot);

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = 400; // Moderate speed
    
    shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    shot.setRotation(angle);

    // Fail-safe cleanup
    scene.time.delayedCall(3000, () => {
        if (shot.active) shot.destroy();
    });
  }
}
