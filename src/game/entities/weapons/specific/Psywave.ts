import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';

/**
 * PsywaveShot (精神波)
 * Projectile that orbits the user.
 */
export class PsywaveShot extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number; // degrees per second
    radius: number;
    currentAngle: number;
    baseDamage: number = 0; // Damage before per-hit variance
    knockback: number = 0;
    
    // Immunity map: Enemy -> Last Hit Time
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 500; // ms between hits on same enemy

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, radius: number, speed: number, startAngle: number) {
        super(scene, x, y, 'projectile'); // Fallback texture, will tint
        this.owner = owner;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.currentAngle = startAngle;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setTint(0x8A2BE2); // Purple
        this.setScale(1.5); // Slightly larger
        this.setAlpha(0.8);
        
        // Circular body
        this.setCircle(10); 
    }

    setup(stats: { baseDamage: number, knockback: number }) {
        this.baseDamage = stats.baseDamage;
        this.knockback = stats.knockback;
        
        // Standard projectile data for collision system
        this.setData('damage', this.baseDamage);
        this.setData('knockback', this.knockback);
        this.setData('pierceCount', 999); // Use 'pierceCount' to match CombatManager, though we override it
        this.setData('owner', this.owner);
        this.setData('weaponId', 'psywave');
        this.setData('isPsywave', true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.scene.time.paused) return;
        
        if (!this.owner || !this.owner.active) {
            this.destroy();
            return;
        }

        // Update Angle
        this.currentAngle += this.orbitSpeed * (delta / 1000);
        
        // Update Position
        const rad = Phaser.Math.DegToRad(this.currentAngle);
        this.x = this.owner.x + Math.cos(rad) * this.radius;
        this.y = this.owner.y + Math.sin(rad) * this.radius;

        // Visual Rotation (face tangent)
        this.setRotation(rad + Math.PI / 2);
    }

    /**
     * Checks if we can hit this enemy ( immunity check )
     */
    canHit(enemy: Phaser.GameObjects.GameObject, now: number): boolean {
        const lastHit = this.hitList.get(enemy);
        if (!lastHit) return true;
        return now > lastHit + this.immunityDuration;
    }

    /**
     * Called by CombatManager when overlapping an enemy.
     * We override standard behavior to handle "orbit" persistence and immunity.
     */
    onHit(enemy: Phaser.GameObjects.GameObject) {
        if (!this.active) return;
        
        const now = this.scene.time.now;
        if (this.canHit(enemy, now)) {
            // Register hit
            this.hitList.set(enemy, now);
            
            // Deal damage via Game Event (to route through CombatManager properly)
            // Use small radius to target this enemy specifically
            if ('x' in enemy && 'y' in enemy) {
                const e = enemy as Phaser.Physics.Arcade.Sprite;
                // Apply per-hit variance (±15%)
                const variance = 0.85 + (Math.random() * 0.30);
                const finalDamage = Math.round(this.baseDamage * variance);
                // Emit isFinal=true
                this.scene.events.emit('spawn-aoe-damage', e.x, e.y, 20, finalDamage, true);
            }
        }
    }
}


export class Psywave extends Weapon implements WeaponConfig {
    id = 'psywave';
    name = 'Psywave (精神波)';
    description = 'Psychic energy that orbits the user.';
    cooldownMs = 4000;
    
    evolution = undefined;
    evolutionLevel = 999;

    getStats(level: number): { damage: number; count: number; speed: number; duration: number; radius: number; cooldown: number; knockback: number } {
        const stats = {
            damage: 10,
            count: 1,
            speed: 150,
            duration: 3000, 
            cooldown: 4000,
            radius: 100,
            knockback: 100
        };

        if (level >= 2) stats.count += 1; // 2
        if (level >= 3) stats.duration += 1000; // 4000
        if (level >= 4) stats.speed += 50; // 200
        if (level >= 5) stats.count += 1; // 3
        if (level >= 6) stats.duration += 1000; // 5000
        if (level >= 7) stats.count += 1; // 4
        if (level >= 8) stats.duration = 999999; // Infinite

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        // Level 8 Check: If Infinite and already active, do nothing
        if (level >= 8) {
            const existing = projectilesGroup.getChildren().filter(
                p => p.active && p.getData('weaponId') === 'psywave' && p.getData('owner') === player
            );
            if (existing.length >= stats.count) {
                 // Already active (or close enough), don't respawn to avoid glitches/stacking
                 return;
            }
            // If some are missing (destroyed somehow), we might want to respawn all?
            // For simplicity: Clear and Respawn if count is wrong, or just let standard logic handle it
            // Let's implement Strict Cleanup below regardless, so if we ARE firing, we reset safely.
            // BUT: If Level 8, we only fire ONCE (or rarely).  
            // The firing loop in CombatManager probably calls `fire` every `cooldownMs`.
            // So if we return here, we just skip "refiring".
            // Correct approach: Return if satisfied.
             if (existing.length > 0) return; 
        }

        // Calculate base damage WITHOUT variance (variance applied per-hit in onHit)
        const playerBase = player.stats.baseDamage || 0;
        const playerMight = player.might || 1;
        const baseDamage = Math.round((stats.damage + playerBase) * playerMight);

        // Calculation
        const step = 360 / stats.count;
        
        for (let i = 0; i < stats.count; i++) {
            const startAngle = step * i;
            
            const projectile = new PsywaveShot(
                scene, 
                player.x, 
                player.y, 
                player, 
                stats.radius, 
                stats.speed, 
                startAngle
            );

            projectilesGroup.add(projectile);
            
            projectile.setup({
                baseDamage: baseDamage,
                knockback: stats.knockback
            });

            // Duration (Level 8 handled by high duration value, but explicit check good too)
            if (level < 8) {
                scene.time.delayedCall(stats.duration, () => {
                    if (projectile.active) projectile.destroy();
                });
            }
        }
    }
}
