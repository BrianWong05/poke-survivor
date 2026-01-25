import type { UltimateConfig, CharacterContext } from '@/game/entities/characters/types';
import { BoneProjectile } from '@/game/entities/projectiles/BoneProjectile';

function getProjectiles(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group | null;
}

export class BoneRush implements UltimateConfig {
  id = 'bone-rush';
  name = 'Bone Rush';
  description = 'Summons bones to orbit the player, increasing speed.';
  cooldownMs = 20000; // 20s cooldown
  durationMs = 8000; // 8s duration

  execute(ctx: CharacterContext): void {
    const { scene, player } = ctx;

    const projectilesGroup = getProjectiles(scene);
    if (!projectilesGroup) return;

    // Apply Speed Buff
    player.moveSpeedMultiplier = 1.5;

    // Spawn 4 projectiles
    const projectiles: BoneProjectile[] = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
        const startAngle = (i / count) * Math.PI * 2;
        const projectile = new BoneProjectile(scene, player, startAngle);
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
