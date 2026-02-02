import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';

/**
 * Stealth Rock Shot (隱形岩)
 * Heavy hitting.
 */
export class StealthRockShot extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number; 
    radius: number;
    currentAngle: number;
    baseDamage: number = 0; // Damage before per-hit variance
    knockback: number = 0;
    
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 800; // Slower hit rate

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, radius: number, speed: number, startAngle: number) {
        super(scene, x, y, 'jagged-rock'); 
        this.owner = owner;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.currentAngle = startAngle;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Visuals
        this.setScale(1.2 + Math.random() * 0.5); // Variance in size
        this.setAngle(Math.random() * 360);       // Random start rotation
        this.setAlpha(1.0);
        this.setCircle(12); // Slightly smaller hitbox than texture 
    }

    setup(stats: { baseDamage: number, knockback: number }) {
        this.baseDamage = stats.baseDamage;
        this.knockback = stats.knockback;
        
        this.setData('damage', this.baseDamage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'stealth-rock');
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
        this.rotation += 2 * (delta / 1000); // Slow spin
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
            // Apply per-hit variance (±15%)
            const variance = 0.85 + (Math.random() * 0.30);
            const finalDamage = Math.round(this.baseDamage * variance);
            // Emit isFinal=true
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 30, finalDamage, true);
        }
    }
}

export class StealthRock extends Weapon implements WeaponConfig {
    id = 'stealth-rock';
    name = 'Stealth Rock (隱形岩)';
    description = 'Heavy rocks that crush enemies.';
    cooldownMs = 5000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 25,
            count: 2,
            speed: 100,
            duration: 4000, 
            cooldown: 5000,
            radius: 120,
            knockback: 50
        };
        // Progression
        if (level >= 2) stats.damage += 10;
        if (level >= 3) stats.duration += 500;
        if (level >= 4) { stats.damage += 10; stats.speed += 10; }
        if (level >= 5) stats.count += 1;
        if (level >= 6) { stats.damage += 15; stats.speed += 10; }
        if (level >= 7) { stats.radius += 20; stats.count += 1; }
        if (level >= 8) { stats.duration = 999999; stats.count += 1; }

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        // Calculate total count (Base + Amount)
        const totalCount = this.getFinalProjectileCount(stats.count, player);

        if (level >= 8) {
            const existing = projectilesGroup.getChildren().filter(
                p => p.active && p.getData('weaponId') === 'stealth-rock' && p.getData('owner') === player
            );
            
            // Return if count matches (Infinite Duration)
            if (existing.length === totalCount) return;
            
            // Else refresh
            existing.forEach(p => p.destroy());
        }

        // Calculate base damage WITHOUT variance (variance applied per-hit in onHit)
        const playerBase = player.stats.baseDamage || 0;
        const playerMight = player.might || 1;
        const baseDamage = Math.round((stats.damage + playerBase) * playerMight);

        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'stealth-rock' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        const step = 360 / totalCount;
        for (let i = 0; i < totalCount; i++) {
            const startAngle = step * i;
            const projectile = new StealthRockShot(
                scene, player.x, player.y, player, 
                stats.radius, stats.speed, startAngle
            );
            projectilesGroup.add(projectile);
            projectile.setup({ baseDamage: baseDamage, knockback: stats.knockback });
            
            if (level < 8) {
                scene.time.delayedCall(stats.duration, () => {
                    if (projectile.active) projectile.destroy();
                });
            }
        }
    }
}
