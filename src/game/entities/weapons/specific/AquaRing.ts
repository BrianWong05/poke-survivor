import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

/**
 * Aqua Ring Shot (水流環)
 * Defines knockback logic.
 */
export class AquaRingShot extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number; 
    radius: number;
    currentAngle: number;
    damage: number = 0;
    knockback: number = 0;
    
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 500; 

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, radius: number, speed: number, startAngle: number) {
        super(scene, x, y, 'projectile'); 
        this.owner = owner;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.currentAngle = startAngle;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setTint(0x00FFFF); // Cyan
        this.setScale(0.6); // NERF: Smaller size (was 1.2)
        this.setAlpha(0.8);
        this.setCircle(12); // Keep circle logic, scale applies to body too usually
    }

    setup(stats: { damage: number, knockback: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        
        // Data for CombatManager
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'aqua-ring');
        this.setData('isOrbit', true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.scene.time.paused) return;
        if (!this.owner || !this.owner.active) {
            this.destroy();
            return;
        }
        this.currentAngle += this.orbitSpeed * (delta / 1000);
        const rad = Phaser.Math.DegToRad(this.currentAngle);
        this.x = this.owner.x + Math.cos(rad) * this.radius;
        this.y = this.owner.y + Math.sin(rad) * this.radius;
        this.setRotation(rad + Math.PI / 2);

        // Sparkle Effect
        if (this.scene.time.now % 100 < delta) { // Roughly every few frames
             // Create a simple sparkle particle
             const sparkle = this.scene.add.sprite(this.x, this.y, 'projectile');
             sparkle.setTint(0xFFFFFF); // White sparkle
             sparkle.setScale(0.2); // Smaller sparkle too
             sparkle.setAlpha(1);
             
             this.scene.tweens.add({
                 targets: sparkle,
                 scale: 0.05,
                 alpha: 0,
                 duration: 400,
                 onComplete: () => sparkle.destroy()
             });
        }
    }

    canHit(enemy: Phaser.GameObjects.GameObject, now: number): boolean {
        const lastHit = this.hitList.get(enemy);
        if (!lastHit) return true;
        return now > lastHit + this.immunityDuration;
    }

    onHit(enemy: Phaser.GameObjects.GameObject) {
        if (!this.active) return;
        const now = this.scene.time.now;
        if (this.canHit(enemy, now)) {
            this.hitList.set(enemy, now);
            
            // Apply Knockback away from player
            const e = enemy as Phaser.Physics.Arcade.Sprite;
            if (e.body) {
                const angle = Phaser.Math.Angle.Between(this.owner.x, this.owner.y, e.x, e.y);
                const kbVectorX = Math.cos(angle) * this.knockback;
                const kbVectorY = Math.sin(angle) * this.knockback;
                e.setVelocity(kbVectorX, kbVectorY);
            }
            // Deal damage
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 20, this.damage);
        }
    }
}

export class AquaRing implements WeaponConfig {
    id = 'aqua-ring';
    name = 'Aqua Ring (水流環)';
    description = 'Protective water ring. Gently pushes enemies.';
    cooldownMs = 6000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 8,          // Low Damage
            count: 2,           // Gaps
            speed: 150,         // Slower
            duration: 3000, 
            cooldown: 5000,
            radius: 120,        // Base Radius
            knockback: 150      // Gentle Push
        };

        // Progression (Nerfed)
        if (level >= 2) stats.count += 1;        // 3
        if (level >= 3) stats.duration += 1000;  // 4000
        if (level >= 4) stats.damage += 4;       // 12
        if (level >= 5) stats.knockback += 50;   // 200 (Cap)
        if (level >= 6) stats.count += 1;        // 4
        if (level >= 7) stats.radius += 20;      // 140
        if (level >= 8) stats.duration = 999999; // Infinite

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        // Level 8 Check
        if (level >= 8) {
            const existing = projectilesGroup.getChildren().filter(
                p => p.active && p.getData('weaponId') === 'aqua-ring' && p.getData('owner') === player
            );
            if (existing.length > 0) return; 
        }

        // Cleanup existing (non-level 8 or refresh)
        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'aqua-ring' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        // Spawn 3 Rings with smaller scale
        const rings = [
            { r: stats.radius - 30, scale: 0.8, speedMult: 1.1 },  // Inner
            { r: stats.radius,      scale: 1.0, speedMult: 1.0 },  // Middle
            { r: stats.radius + 30, scale: 1.2, speedMult: 0.9 }   // Outer
        ];

        rings.forEach((ringConfig, ringIndex) => {
            const step = 360 / stats.count;
            const angleOffset = ringIndex * (360 / (stats.count * 3)); 

            for (let i = 0; i < stats.count; i++) {
                const startAngle = step * i + angleOffset;
                const projectile = new AquaRingShot(
                    scene, player.x, player.y, player, 
                    ringConfig.r, 
                    stats.speed * ringConfig.speedMult, 
                    startAngle
                );
                
                projectilesGroup.add(projectile);
                projectile.setup({ damage: stats.damage, knockback: stats.knockback });
                
                // Base 0.6 scaled by ring config
                projectile.setScale(0.6 * ringConfig.scale); 
                
                if (level < 8) {
                    scene.time.delayedCall(stats.duration, () => {
                        if (projectile.active) projectile.destroy();
                    });
                }
            }
        });
    }
}
