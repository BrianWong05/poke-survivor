import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { FocusBlastProjectile } from '@/game/entities/projectiles/FocusBlastProjectile';
import { Weapon } from '@/game/entities/weapons/Weapon';

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

export class FocusBlast extends Weapon implements WeaponConfig {
  id = 'focus-blast';
  name = 'Focus Blast (真氣彈)';
  description = 'Powerful blast that explodes on impact. High critical chance.';
  cooldownMs = 2000; // Slower fire rate

  // Base stats (stub for now, ideally stats table)
  getStats(_level: number) {
      return { damage: 30 };
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;

    // Focus Blast requires aiming but for auto-battler usually aims at nearest?
    // Spec says: "No Homing (Requires aiming)".
    // In a Survivor-like, "aiming" usually means "fires at nearest enemy at time of firing" but doesn't curve.
    
    const nearestEnemy = findNearestEnemy(scene, player);
    // If no enemy, maybe fire in facing direction?
    // For now, fire at nearest or random if none?
    // If no enemies, do nothing.
    if (!nearestEnemy) return;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Calculate Damage
    const stats = this.getStats(level || 1);
    const finalDamage = this.getCalculatedDamage(stats.damage, player);

    const projectile = new FocusBlastProjectile(scene, player.x, player.y);
    // Set Damage - Use final damage
    projectile.damageAmount = finalDamage;

    projectilesGroup.add(projectile);

    // Apply Inner Focus Modifier
    const sizeModifier = (player as any).projectileSizeModifier || 1.0;
    projectile.setScale(projectile.scale * sizeModifier);

    // Initial Aim
    const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
    const speed = projectile.speed;
    
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    projectile.setRotation(angle);
    
    // Fail-safe / Max Range explode
    // "Focus Blast projectile hits an enemy or expires."
    scene.time.delayedCall(3000, () => {
        if (projectile.active) {
            projectile.explode();
        }
    });
  }
}
