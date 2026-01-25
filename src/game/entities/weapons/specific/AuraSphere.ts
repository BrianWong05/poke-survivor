import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { AuraSphereProjectile } from '@/game/entities/projectiles/AuraSphereProjectile';
import { FocusBlast } from '@/game/entities/weapons/specific/FocusBlast'; 

function getEnemies(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group | null;
}

function getProjectiles(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group | null;
}

function findNearestEnemy(
  scene: Phaser.Scene,
  player: Phaser.Physics.Arcade.Sprite
): Phaser.Physics.Arcade.Sprite | null {
  const enemies = getEnemies(scene);
  if (!enemies) return null;

  const activeEnemies = enemies.getChildren().filter(e => {
    if ('isDying' in e) {
      return !(e as any).isDying && e.active;
    }
    return e.active;
  });

  if (activeEnemies.length === 0) return null;

  return scene.physics.closest(player, activeEnemies) as Phaser.Physics.Arcade.Sprite | null;
}

export class AuraSphere implements WeaponConfig {
  id = 'aura-sphere';
  name = 'Aura Sphere';
  description = 'Releases an aura power that chases enemies.';
  cooldownMs = 1800; 

  evolution = new FocusBlast();
  evolutionLevel = 8;

  fire(ctx: CharacterContext): void {
    const { scene, player } = ctx;

    const nearestEnemy = findNearestEnemy(scene, player);
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    const projectile = new AuraSphereProjectile(scene, player.x, player.y);
    projectilesGroup.add(projectile);

    // Apply Inner Focus Modifier (Task 5 anticipation)
    const sizeModifier = (player as any).projectileSizeModifier || 1.0;
    projectile.setScale(projectile.scale * sizeModifier);

    // Set Target for Homing
    projectile.setTarget(nearestEnemy);

    // Initial Velocity towards target
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = projectile.speed;
    
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    projectile.setRotation(angle);
    
    // Cleanup
    scene.time.delayedCall(2000, () => {
        if (projectile.active) projectile.destroy();
    });
  }
}
