import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { TongueLash } from '@/game/entities/projectiles/TongueLash';

// Helper to determine rotation from animation key
function getRotationFromAnim(player: Phaser.Physics.Arcade.Sprite): number {
    const animKey = player.anims.currentAnim?.key;
    if (!animKey) {
        return player.flipX ? Math.PI : 0;
    }

    // Force horizontal only (Left vs Right)
    // If animation has 'left' anywhere, face left.
    // Otherwise face right (default).
    if (animKey.includes('-left')) return Math.PI;

    return 0; // Right (includes -right, -up, -down, etc.)
}

export class DreamEater implements WeaponConfig {
    id = 'dream-eater';
    name = 'Dream Eater';
    description = 'Devastating attack that combos with Paralysis.';
    cooldownMs = 1000;

    fire(ctx: CharacterContext): void {
        const { scene, player } = ctx;
        const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;

        // Determine facing direction from animation
        const rotation = getRotationFromAnim(player);

        const offsetX = Math.cos(rotation) * 50;
        const offsetY = Math.sin(rotation) * 50;

        const tongue = new TongueLash(
            scene,
            player.x + offsetX,
            player.y + offsetY,
            rotation,
            50,   // Damage
            true  // isDreamEater
        );

        // Add overlap
        if (enemiesGroup) {
            scene.physics.add.overlap(tongue, enemiesGroup, (obj1, obj2) => {
                const t = obj1 as TongueLash;
                const e = obj2 as Phaser.GameObjects.GameObject;
                if (t.handleOverlap) {
                    t.handleOverlap(e);
                }
            });
        }
    }
}

export class Lick implements WeaponConfig {
    id = 'lick';
    name = 'Lick';
    description = 'Licks enemies to paralyze them.';
    cooldownMs = 1000;

    evolution = new DreamEater();
    evolutionLevel = 8;

    fire(ctx: CharacterContext): void {
        const { scene, player } = ctx;
        const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;

        // Determine facing direction from animation
        const rotation = getRotationFromAnim(player);

        const offsetX = Math.cos(rotation) * 50;
        const offsetY = Math.sin(rotation) * 50;

        const tongue = new TongueLash(
            scene,
            player.x + offsetX,
            player.y + offsetY,
            rotation,
            15,    // Damage
            false  // isDreamEater
        );

        if (enemiesGroup) {
            scene.physics.add.overlap(tongue, enemiesGroup, (obj1, obj2) => {
                const t = obj1 as TongueLash;
                const e = obj2 as Phaser.GameObjects.GameObject;
                if (t.handleOverlap) {
                    t.handleOverlap(e);
                }
            });
        }
    }
}
