import Phaser from 'phaser';
import { Weapon } from '@/game/entities/weapons/Weapon';
import type { CharacterContext } from '@/game/entities/characters/types'; // WeaponConfig is implemented by Weapon
import { AuraSphereProjectile } from '@/game/entities/projectiles/AuraSphereProjectile';

function getEnemies(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group | null;
}

function getProjectiles(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group | null;
}



export class AuraSphere extends Weapon {
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

    const finalProjectileCount = this.getFinalProjectileCount(stats.count, player);

    // Find multiple targets (up to count)
    const enemies = getEnemies(scene);
    let targets: Phaser.Physics.Arcade.Sprite[] = [];
    
    if (enemies) {
        const activeEnemies = enemies.getChildren().filter(e => {
            if ('isDying' in e) return !(e as any).isDying && e.active;
            return e.active;
        }) as Phaser.Physics.Arcade.Sprite[];

        // Sort by distance
        activeEnemies.sort((a, b) => {
            const distA = Phaser.Math.Distance.Squared(player.x, player.y, a.x, a.y);
            const distB = Phaser.Math.Distance.Squared(player.x, player.y, b.x, b.y);
            return distA - distB;
        });

        // Take top N distinct targets
        targets = activeEnemies.slice(0, finalProjectileCount);
    }
    
    // Spread calculation: Standard 15 degrees (kept for variance even in burst)
    const angleStep = Phaser.Math.DegToRad(15); 
    const spreadTotal = (finalProjectileCount - 1) * angleStep;
    
    // Use first valid target for base angle, or fallback to random/nearest
    // If we have distinct targets, baseAngle might be less relevant for "aiming", 
    // but we still need an initial direction for the projectile spawn impulse.
    // Let's keep the original baseAngle logic but derived from the PRIMARY target [0]
    let baseAngle = 0;
    if (targets.length > 0) {
        baseAngle = Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y);
    } else {
        baseAngle = (Math.random() * 360) * (Math.PI / 180);
    }

    const startAngle = finalProjectileCount > 1 ? baseAngle - (spreadTotal / 2) : baseAngle;

    // Burst Fire Delay (ms)
    const burstDelay = 100;

    for (let i = 0; i < finalProjectileCount; i++) {
        scene.time.delayedCall(i * burstDelay, () => {
            const projectile = new AuraSphereProjectile(scene, player.x, player.y);
            projectilesGroup.add(projectile);

            // Calculate final damage using base class formula
            const finalDamage = this.getCalculatedDamage(stats.damage, player);

            // Apply Stats
            projectile.setup({
                damage: finalDamage,
                speed: stats.speed,
                turnRate: stats.turnRate,
                pierce: stats.pierce
            });

            // Apply Inner Focus Modifier
            const sizeModifier = (player as any).projectileSizeModifier || 1.0;
            projectile.setScale(projectile.scale * sizeModifier);

            // Set Target (Cyclic or Unique)
            // If we have 2 spheres and 2 targets, match 1:1.
            // If we have 2 spheres and 1 target, both hit target 1.
            const myTarget = targets.length > 0 ? targets[i % targets.length] : null;
            projectile.setTarget(myTarget);

            // Calculate angle for this shot
            // We still use spread to give them different initial trajectories
            // Note: If we have distinct targets, we might want to aim AT them initially?
            // But preserving the "Spread Pattern" is often nicer visually (Shotgun style then home in).
            // Let's stick to the spread pattern relative to the primary target.
            const angle = finalProjectileCount > 1 ? startAngle + (angleStep * i) : baseAngle;

            // Apply Velocity
            projectile.setVelocity(Math.cos(angle) * stats.speed, Math.sin(angle) * stats.speed);
            projectile.setRotation(angle);

            // Cleanup
            scene.time.delayedCall(3000, () => { 
                if (projectile.active) projectile.destroy();
            });
        });
    }
  }
}
