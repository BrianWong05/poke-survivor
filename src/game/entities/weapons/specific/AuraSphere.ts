import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { AuraSphereProjectile } from '@/game/entities/projectiles/AuraSphereProjectile';
 

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
  name = 'Aura Sphere (波導彈)';
  description = 'Releases an aura power that chases enemies.';
  cooldownMs = 1500; 

  // Evolution disabled for now as per specific request for Lvl 8 Aura Sphere behavior
  evolution = undefined;
  evolutionLevel = 999;

  getStats(level: number): { damage: number; count: number; pierce: number; speed: number; turnRate: number; cooldown: number } {
    const stats = {
      damage: 12,
      count: 1,
      pierce: 1, // Hits 2 enemies (1 pierce means hits 1 then has 1 left? Usually pierce 1 means goes through 1. Spec says "Pierce 1 (Hits 2)")
      // Wait, standard pierce usually works as "number of enemies it can pass through". 
      // Spec says: "Pierce 1 (Hits 2)". So if pierce count is 1, it hits, decrements to 0, hits again, decrements to -1, destroys.
      // So pierce = 1 is correct for hitting 2 enemies.
      speed: 500,
      turnRate: 180,
      cooldown: 1500
    };

    if (level >= 2) stats.damage += 4; // 16
    if (level >= 3) stats.count += 1; // 2
    if (level >= 4) stats.pierce += 1; // 2 (Hits 3)
    if (level >= 5) stats.turnRate = 360; 
    if (level >= 6) stats.count += 1; // 3
    if (level >= 7) stats.pierce += 1; // 3 (Hits 4)
    if (level >= 8) stats.turnRate = 999;

    return stats;
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    const stats = this.getStats(level);
    
    // Update cooldown based on stats (if cooldown changes, though strictly it stays 1500 in this spec, but good to have)
    this.cooldownMs = stats.cooldown;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Targeting
    // If we have a target, we aim at it. If not, we aim forward or random.
    let target = findNearestEnemy(scene, player);
    let baseAngle = 0;

    if (target) {
        baseAngle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
    } else {
        // Fallback: Player facing or random
        // Assuming player has 'flipX' or similar, or just random forward arc
        // For now, let's use player's last movement direction if available, else random.
        // Or just Aim right (0) if nothing else. 
        // Let's use random angle for "aura searching" flavor if no enemies nearby? 
        // Or just 0.
        // Actually, if no enemies are nearby, it doesn't matter much.
        // Safe default: 0 (right) or random.
        baseAngle = (Math.random() * 360) * (Math.PI / 180);
    }

    const count = stats.count;
    // Spread calculation: 
    // If count > 1, spread evenly around baseAngle.
    // e.g. 2 shots: -10, +10 (total 20 spread? or centered?)
    // Spec says: "If count > 1, apply a small spread (e.g., -10, +10 degrees)".
    // Let's use 20 degrees total spread.
    
    // Calculate start angle
    const spreadTotal = 20 * (Math.PI / 180); 
    const step = count > 1 ? spreadTotal / (count - 1) : 0;
    const startAngle = count > 1 ? baseAngle - (spreadTotal / 2) : baseAngle;

    for (let i = 0; i < count; i++) {
        const projectile = new AuraSphereProjectile(scene, player.x, player.y);
        projectilesGroup.add(projectile);

        // Apply Stats
        projectile.setup({
            damage: stats.damage,
            speed: stats.speed,
            turnRate: stats.turnRate,
            pierce: stats.pierce
        });

        // Apply Inner Focus Modifier (Task 5 anticipation)
        const sizeModifier = (player as any).projectileSizeModifier || 1.0;
        projectile.setScale(projectile.scale * sizeModifier);

        // Set Target
        projectile.setTarget(target);

        // Calculate angle for this shot
        const angle = count > 1 ? startAngle + (step * i) : baseAngle;

        // Apply Velocity
        projectile.setVelocity(Math.cos(angle) * stats.speed, Math.sin(angle) * stats.speed);
        projectile.setRotation(angle);

        // Cleanup
        scene.time.delayedCall(3000, () => { // Increased logic to 3s to allow homing
            if (projectile.active) projectile.destroy();
        });
    }
  }
}
