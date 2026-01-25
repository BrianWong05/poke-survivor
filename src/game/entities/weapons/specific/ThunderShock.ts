import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { LightningBolt } from '@/game/entities/projectiles/LightningBolt';

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

  // Use physics.closest instead of manual calculation for better performance/simplicity
  // Note: physics.closest might return any game object, so we cast
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

export class Thunderbolt implements WeaponConfig {
  id = 'thunderbolt';
  name = 'Thunderbolt';
  description = 'Fires 2 electric bolts at nearest enemy';
  cooldownMs = 2000;

  fire(ctx: CharacterContext): void {

    
    // Fire 2 projectiles
    // We'll reuse the single fire logic twice with a small delay or offset
    this.fireBolt(ctx, 0);
    this.fireBolt(ctx, 100); // 100ms delay for second bolt
  }

  private fireBolt(ctx: CharacterContext, delay: number): void {
     const { scene, player, stats } = ctx;
     
     scene.time.delayedCall(delay, () => {
         // Re-check nearest enemy at time of firing
         const nearestEnemy = findNearestEnemy(scene, player);
         if (!nearestEnemy || !nearestEnemy.active) return;
         
         const projectilesGroup = getProjectiles(scene);
         if (!projectilesGroup) return;

         // Create custom projectile
         const bolt = new LightningBolt(scene, player.x, player.y);
         
         // Add to group for collision management (MainScene handles this group)
         projectilesGroup.add(bolt);

         // Set damage (evolved damage or standard?)
         // User said "Fire 2 projectiles at once or increase damage to 20"
         // I'll keep base damage but x2 projectiles = double DPS
         bolt.setDamage(stats.baseDamage);
         bolt.setChainCount(2); // Thunderbolt chains twice


         // Calculate direction
         const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
         const speed = 600;
         
         bolt.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
         bolt.setRotation(angle);

         // Cleanup after 3s handled by world bounds or manual timer?
         // LightningBolt doesn't have auto-destroy in constructor, let's add fail-safe here
         scene.time.delayedCall(3000, () => {
             if (bolt.active) bolt.destroy();
         });
     });
  }
}

export class ThunderShock implements WeaponConfig {
  id = 'thunder-shock';
  name = 'Thunder Shock';
  description = 'Targets nearest enemy with electric projectile';
  cooldownMs = 2000;
  
  // Evolution link
  evolution = new Thunderbolt();
  evolutionLevel = 8; // Per requirement

  fire(ctx: CharacterContext): void {
    const { scene, player, stats } = ctx;
    
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Create custom projectile
    const bolt = new LightningBolt(scene, player.x, player.y);
    
    // Add to group for collision management
    projectilesGroup.add(bolt);

    bolt.setDamage(stats.baseDamage);
    bolt.setChainCount(1); // Standard ThunderShock chains once

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = 600;
    
    bolt.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bolt.setRotation(angle);

    // Cleanup
    scene.time.delayedCall(3000, () => {
        if (bolt.active) bolt.destroy();
    });
  }
}
