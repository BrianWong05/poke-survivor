import type { UltimateConfig, CharacterContext } from '@/game/entities/characters/types';
import { BoneProjectile } from '@/game/entities/projectiles/BoneProjectile';
import { Weapon } from '@/game/entities/weapons/Weapon';

function getProjectiles(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group | null;
}

export class BoneRush extends Weapon implements UltimateConfig {
  id = 'bone-rush';
  name = 'Bone Rush (骨頭衝鋒)';
  description = 'Summons bones to orbit the player, increasing speed.';
  cooldownMs = 20000; // 20s cooldown
  durationMs = 8000; // 8s duration

  // Stub to satisfy Weapon abstract if needed, though we primarily use execute for Ultimates
  // But since we extend Weapon, we can use valid logic here too or alias it.
  getStats(_level: number) {
      return { damage: 30 }; // Base Damage
  }

  execute(ctx: CharacterContext): void {
    const { scene, player } = ctx;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Calculate Damage
    const stats = this.getStats(1); // Level 1 (Ultimates usually 1 level?)
    const finalDamage = this.getCalculatedDamage(stats.damage, player);

    // Apply Speed Buff
    player.moveSpeedMultiplier = 1.5;

    // Spawn 4 projectiles
    const projectiles: BoneProjectile[] = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
        const startAngle = (i / count) * Math.PI * 2;
        const projectile = new BoneProjectile(scene, player, startAngle);
        projectile.setDamage(finalDamage);
        projectilesGroup.add(projectile);
        projectiles.push(projectile);
    }

    // Store references to destroy them later (or let delayedCall handle it)
    // We can rely on onEnd to cleanup, but we need to store them.
    player.setData('boneRushProjectiles', projectiles);
  }

  onEnd(ctx: CharacterContext): void {
    const { player } = ctx;

    // Remove Speed Buff
    player.moveSpeedMultiplier = 1.0;

    // Cleanup Projectiles
    const projectiles = player.getData('boneRushProjectiles') as BoneProjectile[];
    if (projectiles) {
        projectiles.forEach(p => {
             if (p.active) p.destroy();
        });
        player.setData('boneRushProjectiles', null);
    }
  }

  // Fallback if used as primary weapon (not expected)
  fire(ctx: CharacterContext): void {
      this.execute(ctx);
  }
}
