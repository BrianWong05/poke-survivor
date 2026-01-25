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
  description = 'Fires a small fireball';
  cooldownMs = 1200; // Slow
  
  evolution = new Flamethrower();
  evolutionLevel = 8;

  fire(ctx: CharacterContext): void {
    const { scene, player } = ctx;
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Create fireball
    const fireball = new Fireball(scene, player.x, player.y);
    projectilesGroup.add(fireball);

    // Ember stats (Level 1)
    fireball.setDamage(8);
    fireball.setPierce(0);
    fireball.setProjectileTint(0xFF4500); // Red
    fireball.setScale(1.0);

    // Fire at enemy
    fireball.fireAt(nearestEnemy.x, nearestEnemy.y);

    // Cleanup
    scene.time.delayedCall(2000, () => {
        if (fireball.active) fireball.destroy();
    });
  }
}
