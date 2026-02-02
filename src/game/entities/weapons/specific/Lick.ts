import type { CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';
import { LickHitbox } from '@/game/entities/weapons/hitboxes/LickHitbox';

export class Lick extends Weapon {
    id = 'lick';
    name = 'Lick (舌舔)';
    description = 'Licks enemies in front of you. Causes paralysis at high levels.';
    cooldownMs = 1000;

    evolution = undefined;
    evolutionLevel = 8; // Max level logic usually

    getStats(level: number): { damage: number; area: number; cooldown: number; count: number; duration: number; paralysisChance: number } {
        const stats = {
            damage: 15,
            area: 1.0,
            cooldown: 800, // Faster (was 1000)
            count: 1,
            duration: 150,
            paralysisChance: 0
        };

        if (level >= 2) stats.damage = 20; // +5
        if (level >= 3) stats.area = 1.25; // +25%
        if (level >= 4) stats.count = 2; // Front & Back
        if (level >= 5) stats.damage = 25; // +5
        if (level >= 6) stats.area = 1.5; // +25%
        if (level >= 7) stats.damage = 35; // +10
        if (level >= 8) stats.paralysisChance = 0.3; // 30% Paralysis

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;

        if (!projectilesGroup) {
            console.warn('Projectiles group not found in registry');
            return;
        }

        // Configuration
        const baseLength = 120;
        const baseThickness = 25;
        
        // Width (Range) now scales with Area again
        const width = baseLength * stats.area; 
        const height = baseThickness * stats.area;

        // Determine Direction
        const horizontalFacing = player.getData('horizontalFacing');
        // Default to Right if undefined
        const facingRight = horizontalFacing !== 'left'; 
        const directionScalar = facingRight ? 1 : -1;

        // Calculate final damage (snapshot for this lick)
        const finalDamage = this.getCalculatedDamage(stats.damage, player);

        const spawnLick = (dirScalar: number) => {
             const isRight = dirScalar > 0;
             // X Offset
             
             const hitbox = new LickHitbox(
                 scene,
                 player.x + (20 * dirScalar), // Small offset from center so it looks like coming from mouth
                 player.y - 5, // Slightly up for mouth height?
                 width,
                 height,
                 finalDamage,
                 stats.duration,
                 stats.paralysisChance
             );
             
             if (!isRight) {
                 hitbox.setFlipX(true);
                 // Adjust position for valid direction
                 hitbox.x = player.x - 20;
                 hitbox.setOrigin(1, 0.5); // Anchor Right Center for left shot?
             }
             
             // Add to group for collision
             projectilesGroup.add(hitbox);
        };

        // Fire Front
        spawnLick(directionScalar);

        // Fire Back (Count >= 2)
        if (stats.count >= 2) {
            spawnLick(-directionScalar);
        }
    }
}

export class DreamEater extends Weapon {
    id = 'dream-eater';
    name = 'Dream Eater';
    description = 'Devours dreams of sleeping enemies. Heals HP.';
    cooldownMs = 1000;

    getStats(_level: number) {
        return {
            damage: 50,
            area: 2.0,
            cooldown: 1000,
            count: 2,
            duration: 150,
            paralysisChance: 0.3
        };
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;

        if (!projectilesGroup) return;

        const baseLength = 80;
        const baseThickness = 40;
        
        const width = baseLength * stats.area;
        const height = baseThickness * stats.area;

        const horizontalFacing = player.getData('horizontalFacing');
        const facingRight = horizontalFacing !== 'left'; 
        const directionScalar = facingRight ? 1 : -1;

        // Calculate final damage
        const finalDamage = this.getCalculatedDamage(stats.damage, player);

        const spawnLick = (dirScalar: number) => {
             const isRight = dirScalar > 0;
             const hitbox = new LickHitbox(
                 scene,
                 player.x + (20 * dirScalar),
                 player.y - 5,
                 width,
                 height,
                 finalDamage,
                 stats.duration,
                 stats.paralysisChance
             );
             if (!isRight) {
                 // hitbox.setFlipX(true); // Texture flip if needed
                 hitbox.x = player.x - 20;
                 hitbox.setOrigin(1, 0.5);
             }
             projectilesGroup.add(hitbox);
        };

        spawnLick(directionScalar);
        if (stats.count >= 2) spawnLick(-directionScalar);
    }
}
