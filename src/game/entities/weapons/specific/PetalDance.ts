import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

/**
 * Petal Dance Shot (花瓣舞)
 * High speed, high count.
 */
export class PetalDanceShot extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number; 
    radius: number;
    currentAngle: number;
    damage: number = 0;
    knockback: number = 0;
    
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 400; // Slightly lower immunity to hit faster?

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, radius: number, speed: number, startAngle: number) {
        super(scene, x, y, 'petal'); 
        this.owner = owner;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.currentAngle = startAngle;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Visuals
        this.setScale(1.0 + Math.random() * 0.5); // Variance (Larger)
        this.setAlpha(0.9);
        this.setAngle(Math.random() * 360);       // Random start rotation
        this.setCircle(8); 
    }

    setup(stats: { damage: number, knockback: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'petal-dance');
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

        // Tumbling effect
        this.rotation += 4 * (delta / 1000); // Fast spin
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
            const e = enemy as Phaser.Physics.Arcade.Sprite;
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 15, this.damage);
        }
    }
}

export class PetalDance implements WeaponConfig {
    id = 'petal-dance';
    name = 'Petal Dance (花瓣舞)';
    description = 'A grinder of spinning petals.';
    cooldownMs = 4000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 5,
            count: 4,
            speed: 250,
            duration: 3000, 
            cooldown: 4000,
            radius: 90,
            knockback: 10
        };
        // Progression
        if (level >= 2) stats.count += 1; // 5
        if (level >= 3) stats.speed += 50; // 300
        if (level >= 4) stats.count += 1; // 6
        if (level >= 5) stats.speed += 50; // 350
        if (level >= 6) stats.count += 2; // 8
        if (level >= 7) stats.damage += 3; // 8
        if (level >= 8) { stats.duration = 999999; stats.count += 4; } // 12 Petals (Storm!)

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
                p => p.active && p.getData('weaponId') === 'petal-dance' && p.getData('owner') === player
            );
            if (existing.length > 0) return; 
        }

        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'petal-dance' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        const step = 360 / stats.count;
        for (let i = 0; i < stats.count; i++) {
            const startAngle = step * i;
            // Swarm Variance
            const variance = (Math.random() - 0.5) * 40; // +/- 20px radius variance
            const projectile = new PetalDanceShot(
                scene, player.x, player.y, player, 
                stats.radius + variance, stats.speed + (variance * 2), startAngle // Inner petals spin faster? or just variance
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
