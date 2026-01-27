import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

/**
 * Parabolic Charge Shot (拋物面充電)
 * Heals player.
 */
export class ParabolicChargeShot extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number; 
    radius: number;
    currentAngle: number;
    damage: number = 0;
    knockback: number = 0;

    baseScale: number = 0.6;
    
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 500; 

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, radius: number, speed: number, startAngle: number) {
        super(scene, x, y, 'electric-field'); 
        this.owner = owner;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.currentAngle = startAngle;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setTint(0xFFFF00); // Yellow
        this.setScale(this.baseScale); 
        this.setAlpha(0.3);
        this.setDepth(5); // Behind player
        this.setCircle(128); 
        this.body?.setCircle(128); 
    }

    setup(stats: { damage: number, knockback: number, scale?: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        if (stats.scale) this.baseScale = stats.scale;
        
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'parabolic-charge');
        this.setData('isOrbit', true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.scene.time.paused) return;
        if (!this.owner || !this.owner.active) {
            this.destroy();
            return;
        }
        
        // Stick to owner center (Field)
        this.x = this.owner.x;
        this.y = this.owner.y;

        // Pulse Effect

        const pulse = Math.sin(time / 150) * 0.05;
        this.setScale(this.baseScale + pulse);

        // Lightning Effect
        if (time % 100 < delta) { // Frequent sparks
             const angle = Math.random() * Math.PI * 2;
             const dist = Math.random() * (120 * this.scale); // Within field (approx radius)
             const tx = this.x + Math.cos(angle) * dist;
             const ty = this.y + Math.sin(angle) * dist;

             const graphics = this.scene.add.graphics();
             graphics.lineStyle(3, 0xFFFFAA, 1);
             
             // Jagged Line
             graphics.beginPath();
             graphics.moveTo(this.x, this.y);
             const segments = 5;
             for (let i = 1; i < segments; i++) {
                 const t = i / segments;
                 const px = this.x + (tx - this.x) * t;
                 const py = this.y + (ty - this.y) * t;
                 const offset = 15;
                 const ox = (Math.random() - 0.5) * 2 * offset;
                 const oy = (Math.random() - 0.5) * 2 * offset;
                 graphics.lineTo(px + ox, py + oy);
             }
             graphics.lineTo(tx, ty);
             graphics.strokePath();
             
             // Fade out lightning
             this.scene.tweens.add({
                 targets: graphics,
                 alpha: 0,
                 duration: 100,
                 onComplete: () => graphics.destroy()
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
            
            // Heal (existing logic)
            const combatManager = this.scene.registry.get('combatManager');
            if (combatManager && typeof combatManager.healPlayer === 'function') {
                combatManager.healPlayer(1);
            }

            const e = enemy as Phaser.Physics.Arcade.Sprite;
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 20, this.damage);
        }
    }
}

export class ParabolicCharge implements WeaponConfig {
    id = 'parabolic-charge';
    name = 'Parabolic Charge (拋物面充電)';
    description = 'Electric field that heals you.';
    cooldownMs = 4000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 8,
            count: 1,           
            speed: 0,           
            duration: 3000, 
            cooldown: 4500,
            radius: 0,          
            knockback: 50,
            scale: 0.6          // Base Scale
        };
        // Progression
        if (level >= 2) stats.damage += 2;
        if (level >= 3) stats.duration += 250;
        if (level >= 4) { stats.knockback += 10; stats.scale += 0.1; }
        if (level >= 5) stats.damage += 5;
        if (level >= 6) { stats.duration += 250; stats.scale += 0.1; }
        if (level >= 7) stats.damage += 5;
        if (level >= 8) { stats.duration = 999999; } // Removed extra scale boost 

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        // Ensure only one field exists per player
        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'parabolic-charge' && p.getData('owner') === player
        );
        
        if (existing.length > 0) {
             if (level >= 8) return;
             existing.forEach(p => p.destroy());
        }

        const projectile = new ParabolicChargeShot(
            scene, player.x, player.y, player, 
            stats.radius, stats.speed, 0
        );
        projectilesGroup.add(projectile);
        projectile.setup({ damage: stats.damage, knockback: stats.knockback, scale: stats.scale });
        
        if (level < 8) {
            scene.time.delayedCall(stats.duration, () => {
                if (projectile.active) projectile.destroy();
            });
        }
    }
}
