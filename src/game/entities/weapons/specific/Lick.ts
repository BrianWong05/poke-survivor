import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { LickHitbox } from '@/game/entities/weapons/hitboxes/LickHitbox';

export class Lick implements WeaponConfig {
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

        // Spawn Front Lick
        // Offset X: 50 * direction
        // Origin of LickHitbox is (0, 0.5) [Left Center].
        // If facing Right: Position at PlayerX + Offset. Texture draws to right. Correct.
        // If facing Left: Position at PlayerX - Offset? 
        // If we spawn at X-50, and texture draws Right... it will overlap player? 
        // usage of setFlipX on hitbox?
        // LickHitbox is a sprite.
        // If facing Left, we should setFlipX(true)? 
        // If Origin is (0, 0.5):
        // Normal (Right): [Origin]======>
        // Flipped (Left): <======[Origin]
        // So if facing Left, we position at PlayerX, and Flip?
        // Or position at PlayerX - (Width + Offset)?
        // Flipping is usually easier for sprites.
        
        const spawnLick = (dirScalar: number) => {
             const isRight = dirScalar > 0;
             // X Offset. If Right, starts slightly in front (e.g. 10px).
             // If Left, starts slightly in front (e.g. -10px).
             // The prompt said "attached to the player (offset X by 50px)".
             // Let's stick to that.
             
             // If we flip the sprite, the origin behavior changes in visual terms but pivot stays?
             // Phaser Sprite Flip: Texture is flipped. Origin 0,0.5 means pivot is at Left-Center of ORIGINAL texture.
             // If flipped, pivot is now Right-Center of visual? 
             // Usually: Flipped sprite with origin 0,0 draws from 0,0 to -width,height.
             // Let's assume standard behavior.
             
             const hitbox = new LickHitbox(
                 scene,
                 player.x + (20 * dirScalar), // Small offset from center so it looks like coming from mouth
                 player.y - 5, // Slightly up for mouth height?
                 width,
                 height,
                 stats.damage,
                 stats.duration,
                 stats.paralysisChance
             );
             
             if (!isRight) {
                 hitbox.setFlipX(true);
                 // If flipped with origin (0, 0.5), it might draw backwards? 
                 // We should verify. For a colored rect generated texture, flipX might not change pixels (uniform pink).
                 // But it changes the "direction" if we had a tongue tip.
                 // Also for Physics Body: setFlipX doesn't rotate physics body!
                 // Handled in LickHitbox? LickHitbox sets body size.
                 // If generic rect, we might need to adjust body offset if flipped.
                 // HOWEVER, LickHitbox constructor sets body size.
                 // If we flip, we might need to manually shift the body X?
                 // Simple solution for rectangle: 
                 // If Left, set X to PlayerX - Width - Offset. Don't flip physics.
                 // Visual flip only affects texture.
                 // Let's rely on standard positioning without flip for physics consistency if texture is uniform.
                 // But "Pink Rectangle" is uniform.
                 // So:
                 // Front Right: X = PlayerX + 20.
                 // Front Left: X = PlayerX - 20 - Width. (To extend left)
             }
             
             // Adjust position for valid direction
             if (!isRight) {
                 // Reposition strictly based on Width to extend Left
                 hitbox.x = player.x - 20 - width; // Start 20px left, extend Width further left?
                 // Wait, hitbox origin is 0,0.5 (Left of box).
                 // So Box spans [x, x+w].
                 // We want Box to span [Player - 20 - w, Player - 20].
                 // So set x = Player - 20 - w.
                 hitbox.x = player.x - 20;
                 hitbox.setOrigin(1, 0.5); // Anchor Right Center for left shot?
                 // changing origin updates body position usually.
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

export class DreamEater implements WeaponConfig {
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

        const spawnLick = (dirScalar: number) => {
             const isRight = dirScalar > 0;
             const hitbox = new LickHitbox(
                 scene,
                 player.x + (20 * dirScalar),
                 player.y - 5,
                 width,
                 height,
                 stats.damage,
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
