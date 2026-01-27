import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

/**
 * Will-O-Wisp Shot (鬼火)
 * Applies burn.
 */
export class WillOWispShot extends Phaser.Physics.Arcade.Sprite {
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

        this.setTint(0x800080); // Purple
        this.setScale(1.1);
        this.setAlpha(0.9);
        this.setCircle(10); 
    }

    setup(stats: { damage: number, knockback: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'will-o-wisp');
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
            
            // Roll for Burn (30%)
            if (Math.random() < 0.3) {
                 // Assumption: enemy has applyStatus, if not via data/event?
                 // Let's use event emission for status effects if possible or setData
                 enemy.setData('status_burn', this.scene.time.now + 3000);
                 (enemy as Phaser.GameObjects.Sprite).setTint(0xFF4500); // Visual burn
            }

            const e = enemy as Phaser.Physics.Arcade.Sprite;
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 20, this.damage);
        }
    }
}

export class WillOWisp implements WeaponConfig {
    id = 'will-o-wisp';
    name = 'Will-O-Wisp (鬼火)';
    description = 'Ghostly flames that burn enemies.';
    cooldownMs = 4000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 10,
            count: 3,
            speed: 180,
            duration: 3000, 
            cooldown: 4000,
            radius: 100,
            knockback: 0
        };
        // Progression
        if (level >= 2) stats.count += 1;
        if (level >= 3) stats.duration += 1000;
        if (level >= 4) stats.speed += 30;
        if (level >= 5) stats.count += 1;
        if (level >= 6) stats.damage += 5;
        if (level >= 7) stats.duration += 1000;
        if (level >= 8) stats.duration = 999999;

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        if (level >= 8) {
            const existing = projectilesGroup.getChildren().filter(
                p => p.active && p.getData('weaponId') === 'will-o-wisp' && p.getData('owner') === player
            );
            if (existing.length > 0) return; 
        }

        // Cleanup
        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'will-o-wisp' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        const step = 360 / stats.count;
        for (let i = 0; i < stats.count; i++) {
            const startAngle = step * i;
            const projectile = new WillOWispShot(
                scene, player.x, player.y, player, 
                stats.radius, stats.speed, startAngle
            );
            projectilesGroup.add(projectile);
            projectile.setup({ damage: stats.damage, knockback: stats.knockback });
            
            if (level < 8) {
                scene.time.delayedCall(stats.duration, () => {
                    if (projectile.active) projectile.destroy();
                });
            }
        }
    }
}
