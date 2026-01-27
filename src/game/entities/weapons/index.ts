import type { CharacterContext, WeaponConfig } from '@/game/entities/characters/types';
import Phaser from 'phaser'; // Needed for helpers below
import { Ember } from './specific/Ember';

import { Lick } from './specific/Lick';
import { BodySlam } from './specific/BodySlam';
import { AuraSphere } from './specific/AuraSphere';
import { FocusBlast } from './specific/FocusBlast';
import { WaterPulse } from './specific/WaterPulse';
import { Psywave } from './specific/Psywave';

export const ember = new Ember();

export const lick = new Lick();
export const bodySlam = new BodySlam();
export const auraSphere = new AuraSphere();
export const focusBlast = new FocusBlast();
export const psywave = new Psywave();

// Exports for evolutions if needed directly (though usually accessed via weapon.evolution)
export const dreamEater = lick.evolution;

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

  let nearest: Phaser.Physics.Arcade.Sprite | null = null;
  let nearestDist = Infinity;

  enemies.getChildren().forEach((child) => {
    const enemy = child as Phaser.Physics.Arcade.Sprite;
    if (!enemy.active) return;

    const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemy;
    }
  });

  return nearest;
}

// ============================================================================
// PIKACHU WEAPONS
// ============================================================================

/**
 * Volt Tackle evolution: Player dashes forward invincibly
 */
export const voltTackle: WeaponConfig = {
  id: 'volt-tackle',
  name: 'Volt Tackle',
  description: 'Dash forward invincibly, leaving electric trail',
  cooldownMs: 2000,
  fire: (ctx: CharacterContext) => {
    const { scene, player } = ctx;
    
    // Get facing direction from velocity or default to right
    const vx = player.body?.velocity.x ?? 0;
    const vy = player.body?.velocity.y ?? 0;
    const len = Math.sqrt(vx * vx + vy * vy);
    const dirX = len > 0 ? vx / len : 1;
    const dirY = len > 0 ? vy / len : 0;
    
    // Make player invincible during dash
    player.setData('invincible', true);
    player.setTint(0xffff00);
    
    // Dash forward
    const dashDistance = 150;
    const dashDuration = 200;
    
    scene.tweens.add({
      targets: player,
      x: player.x + dirX * dashDistance,
      y: player.y + dirY * dashDistance,
      duration: dashDuration,
      onComplete: () => {
        player.setData('invincible', false);
        player.clearTint();
      },
    });
    
    // Leave electric trail (damage enemies along path)
    const trailPoints = 5;
    for (let i = 0; i < trailPoints; i++) {
      const delay = (dashDuration / trailPoints) * i;
      scene.time.delayedCall(delay, () => {
        scene.events.emit('spawn-aoe-damage', player.x, player.y, 30, ctx.stats.baseDamage);
      });
    }
  },
};

/**
 * Thunder Shock: Targets nearest enemy with homing projectile
 */
export const thunderShock: WeaponConfig = {
  id: 'thunder-shock',
  name: 'Thunder Shock',
  description: 'Targets nearest enemy with electric projectile',
  cooldownMs: 1000,
  evolution: voltTackle,
  evolutionLevel: 5,
  fire: (ctx: CharacterContext) => {
    const { scene, player } = ctx;
    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectiles = getProjectiles(scene);
    if (!projectiles) return;

    const projectile = projectiles.get(player.x, player.y, 'projectile') as Phaser.Physics.Arcade.Sprite | null;
    if (!projectile) return;

    projectile.setActive(true);
    projectile.setVisible(true);
    projectile.setPosition(player.x, player.y);
    projectile.setTint(0xffff00); // Yellow for electric
    projectile.setData('damage', ctx.stats.baseDamage);

    // Calculate direction to enemy
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = 400;
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Destroy after 3 seconds
    scene.time.delayedCall(3000, () => {
      if (projectile.active) {
        projectile.setActive(false);
        projectile.setVisible(false);
      }
    });
  },
};

// ============================================================================
// BLASTOISE WEAPONS
// ============================================================================

/**
 * Hydro Cannon evolution: Spiral streams creating no-go zone
 */
export const hydroCannon: WeaponConfig = {
  id: 'hydro-cannon',
  name: 'Hydro Cannon',
  description: 'Two massive spiral streams, creates no-go zone',
  cooldownMs: 2000,
  fire: (ctx: CharacterContext) => {
    const { scene, player, stats } = ctx;
    
    // Create two spiral projectiles
    const projectiles = getProjectiles(scene);
    if (!projectiles) return;
    
    for (let i = 0; i < 2; i++) {
      const projectile = projectiles.get(player.x, player.y, 'projectile') as Phaser.Physics.Arcade.Sprite | null;
      if (!projectile) continue;
      
      projectile.setActive(true);
      projectile.setVisible(true);
      projectile.setTint(0x0088ff);
      projectile.setScale(3);
      projectile.setData('damage', stats.baseDamage * 2);
      projectile.setData('knockback', 200);
      
      // Spiral outward
      const startAngle = i * Math.PI;
      let angle = startAngle;
      let radius = 20;
      
      scene.time.addEvent({
        delay: 50,
        repeat: 40,
        callback: () => {
          angle += 0.3;
          radius += 5;
          projectile.setPosition(
            player.x + Math.cos(angle) * radius,
            player.y + Math.sin(angle) * radius
          );
        },
      });
      
      scene.time.delayedCall(2000, () => {
        projectile.setActive(false);
        projectile.setVisible(false);
        projectile.setScale(1);
      });
    }
  },
};

/**
 * Water Pulse: High speed pulses of water
 */
export const waterPulse = new WaterPulse();
