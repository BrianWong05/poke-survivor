import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { Shockwave } from '@/game/entities/projectiles/Shockwave';

export class GigaImpact implements WeaponConfig {
    id = 'giga-impact';
    name = 'Giga Impact';
    description = 'Massive shockwave that stuns enemies.';
    cooldownMs = 3000;

    fire(ctx: CharacterContext): void {
        const { scene, player } = ctx;
        const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;

        // Create Shockwave
        // x, y, targetScale, damage, knockback, stunDuration, tint
        // Radius 300px (Reduced from 400). Base texture radius is 60. 
        // 300 / 60 = 5.0 scale. 
        const targetScale = 300 / 60; 

        const wave = new Shockwave(
            scene, 
            player.x, 
            player.y, 
            targetScale, 
            50, // Damage
            600, // Knockback (Nerfed from 800)
            1000, // Stun 1000ms
            0x800080 // Purple
        );

        // Add overlap
        if (enemiesGroup) {
            scene.physics.add.overlap(wave, enemiesGroup, (obj1, obj2) => {
                const w = obj1 as Shockwave;
                const e = obj2 as Phaser.GameObjects.GameObject;
                if (w.handleOverlap) {
                    w.handleOverlap(e);
                }
            });
        }
    }
}

export class BodySlam implements WeaponConfig {
    id = 'body-slam';
    name = 'Body Slam';
    description = 'Slam the ground to create a shockwave.';
    cooldownMs = 2500;

    evolution = new GigaImpact();
    evolutionLevel = 8;

    fire(ctx: CharacterContext): void {
        const { scene, player } = ctx;
        const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;

        // Radius 120px (Reduced from 150). Base 60.
        // 120 / 60 = 2.0
        const targetScale = 120 / 60;

        const wave = new Shockwave(
            scene, 
            player.x, 
            player.y, 
            targetScale, 
            20, // Damage
            350, // Knockback (Nerfed from 500)
            0, // No Stun
            0xffffff // White
        );

        // Add overlap
        if (enemiesGroup) {
            scene.physics.add.overlap(wave, enemiesGroup, (obj1, obj2) => {
                const w = obj1 as Shockwave;
                const e = obj2 as Phaser.GameObjects.GameObject;
                if (w.handleOverlap) {
                    w.handleOverlap(e);
                }
            });
        }
    }
}
