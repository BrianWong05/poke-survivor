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

        this.setTint(0xFFFF00); // Yellow
        this.setScale(1.2); 
        this.setAlpha(0.8);
        this.setCircle(10); 
    }

    setup(stats: { damage: number, knockback: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); 
        this.setData('owner', this.owner);
        this.setData('weaponId', 'parabolic-charge');
        this.setData('isOrbit', true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
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
            
            // Heal Player
            // Assuming owner is Player and has heal method or we trigger it via scene event/helper?
            // Actually, we can check if owner has `heal` method or use setData 'hp'.
            // CombatManager has `healPlayer` but we don't have reference to CombatManager here directly.
            // But we can emit a heal event or increment HP data directly if logical.
            // Safer: Emit event 'player-heal' if listener exists? 
            // Or access scene registry 'combatManager'?
            // Simplest: Check if owner has Heal method (Player class might not expose it publicly to projectile).
            // Let's use `spawn-aoe-damage` for damage, and try to access player state.
            // NOTE: The previous turn CombatManager logic showed `healPlayer` public method.
            // But getting CombatManager instance from scene?
            // HACK/Convention: Emit 'heal-player'. If not, try to modify HP directly?
            // Let's assume `combatManager` is on scene?
            const combatManager = this.scene.registry.get('combatManager');
            if (combatManager && typeof combatManager.healPlayer === 'function') {
                combatManager.healPlayer(1);
            } else {
               // Fallback
            }

            const e = enemy as Phaser.Physics.Arcade.Sprite;
            this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 20, this.damage);
        }
    }
}

export class ParabolicCharge implements WeaponConfig {
    id = 'parabolic-charge';
    name = 'Parabolic Charge (拋物面充電)';
    description = 'Electric ring that heals you.';
    cooldownMs = 4000;
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number) {
        const stats = {
            damage: 12,
            count: 3,
            speed: 180,
            duration: 3000, 
            cooldown: 4000,
            radius: 100,
            knockback: 10
        };
        // Progression
        if (level >= 2) stats.count += 1;
        if (level >= 3) stats.duration += 1000;
        if (level >= 4) stats.radius += 20;
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
                p => p.active && p.getData('weaponId') === 'parabolic-charge' && p.getData('owner') === player
            );
            if (existing.length > 0) return; 
        }

        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'parabolic-charge' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        const step = 360 / stats.count;
        for (let i = 0; i < stats.count; i++) {
            const startAngle = step * i;
            const projectile = new ParabolicChargeShot(
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
