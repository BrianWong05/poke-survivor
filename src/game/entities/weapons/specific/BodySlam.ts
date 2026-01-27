import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

export class BodySlam implements WeaponConfig {
    id = 'body-slam';
    name = 'Body Slam';
    description = 'Slam the ground to create a shockwave (AOE).';
    cooldownMs = 1500;

    /**
     * Level 8 is "Massive Size", but it's not a separate evolution name in the prompt.
     * We keep it simple. If an evolution is strictly required by the interface, 
     * we can keep it null or define a dummy one, but usually it's optional.
     */
    evolution = undefined;
    evolutionLevel = 999; 

    getStats(level: number): { damage: number; area: number; cooldown: number; knockback: number; stun: number } {
        const stats = {
            damage: 15, // Reduced from 20
            area: 160, // Increased from 140
            cooldown: 1500, // Reduced from 2000
            knockback: 500,
            stun: 0
        };

        if (level >= 2) stats.area = 180; // + ~12%
        if (level >= 3) stats.damage = 25; // +10
        if (level >= 4) stats.cooldown = 1200; // -300ms
        if (level >= 5) stats.area = 210; // + ~15%
        if (level >= 6) stats.damage = 40; // +15
        if (level >= 7) stats.stun = 1000; // Add stun
        if (level >= 8) stats.area = 300; // Massive Size

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
        const stats = this.getStats(level);

        // 1. Visuals: Shockwave Effect
        const graphics = scene.add.graphics({ x: player.x, y: player.y });
        graphics.setDepth(player.depth - 1); 
        
        // Style: White, thick stroke
        // We want the OUTER edge of the stroke to match stats.area exactly.
        // Let's use a nice thick wave.
        const width = Math.max(10, stats.area * 0.1); 
        
        // If stroke is colored white/grey
        graphics.lineStyle(width, 0xFFFFFF, 0.8);
        
        // strokeCircle draws centered on the radius.
        // To make the outer edge = stats.area, we draw at radius = stats.area - width/2.
        graphics.strokeCircle(0, 0, stats.area - width / 2);
        
        // Inner ripple
        graphics.lineStyle(width * 0.5, 0xDDDDDD, 0.5);
        graphics.strokeCircle(0, 0, (stats.area - width / 2) * 0.7);

        graphics.setScale(0);
        graphics.setAlpha(1);

        scene.tweens.add({
            targets: graphics,
            scaleX: 1,
            scaleY: 1,
            alpha: 0, 
            duration: 150, // Faster expansion (150ms) to feel more "instant" like the damage
            ease: 'Quad.out',
            onComplete: () => {
                graphics.destroy();
            }
        });

        // Effect 2: Ground distortion/particle burst (optional, keeping minimal for now)

        // Screen Shake
        scene.cameras.main.shake(150, 0.015); // Slightly longer shake

        // 2. Physics (The Slam)
        if (enemiesGroup) {
            const enemies = enemiesGroup.getChildren();
            const rangeSq = stats.area * stats.area; // Use squared distance for perf

            enemies.forEach((child) => {
                const enemy = child as Phaser.Physics.Arcade.Sprite;
                if (!enemy.active) return;
                
                // Manual distance check (Circular AOE centered on player)
                const distSq = Phaser.Math.Distance.Squared(player.x, player.y, enemy.x, enemy.y);
                
                if (distSq <= rangeSq) {
                    // Apply Damage
                    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
                        (enemy as any).takeDamage(stats.damage);
                    } else {
                        // Fallback event
                        scene.events.emit('damage-enemy', enemy, stats.damage);
                    }

                    // Apply Massive Knockback (Away from player)
                    const angle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
                    const pushVector = new Phaser.Math.Vector2(
                         Math.cos(angle) * stats.knockback,
                         Math.sin(angle) * stats.knockback
                    );

                    // Check for stun support
                    const stunDuration = stats.stun > 0 ? stats.stun : 300; // Default mini-stun if not Lvl 7
                    
                    if ('applyKnockback' in enemy && typeof (enemy as any).applyKnockback === 'function') {
                         (enemy as any).applyKnockback(pushVector, stunDuration);
                    }
                }
            });
        }
    }
}
