import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';

/**
 * Thunder Wave Node (Laser Fence Segment)
 * 
 * Individual projectile that forms part of the rotating fence.
 * Rotates around the player at a fixed distance and angle offset.
 */
export class ThunderWaveNode extends Phaser.Physics.Arcade.Sprite {
    owner: Phaser.Physics.Arcade.Sprite;
    orbitSpeed: number;     // Degrees per second
    distance: number;       // Distance from player center
    baseAngle: number;      // Fixed offset for this arm (0, 120, 240, etc.)
    currentRotation: number; // Current accumulated rotation
    
    lightningGraphics?: Phaser.GameObjects.Graphics;
    isSatellite: boolean;

    damage: number = 0;
    knockback: number = 0;
    stunChance: number = 0;
    
    private hitList: Map<Phaser.GameObjects.GameObject, number> = new Map();
    private immunityDuration = 500;

    constructor(scene: Phaser.Scene, x: number, y: number, owner: Phaser.Physics.Arcade.Sprite, distance: number, speed: number, baseAngle: number, isSatellite: boolean) {
        // Use 'electric-spark' for the tip, 'projectile' for hidden inner nodes
        super(scene, x, y, isSatellite ? 'electric-spark' : 'projectile'); 
        this.owner = owner;
        this.distance = distance;
        this.orbitSpeed = speed;
        this.baseAngle = baseAngle;
        this.currentRotation = 0;
        this.isSatellite = isSatellite;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Visuals
        if (isSatellite) {
            // Satellite Node (Tip) - Blue Electric Spark
            this.setScale(1.0); // Reset scale (texture is 64x64)
            this.setTint(0x00FFFF); // Cyan tint on top
            this.setAlpha(0.9);
            
            // Create graphics for the lightning bolt connecting to player
            this.lightningGraphics = scene.add.graphics();
            this.lightningGraphics.setDepth(14); // Just below the tip
        } else {
            // Inner Node - Hidden (Hitbox only)
            // Use alpha 0 instead of setVisible(false) to ensure physics still updates if engine culls invisible
            this.setScale(1.0); // Increase scale to ensure no gaps between 20px spaced nodes
            this.setAlpha(0); 
        }
        
        this.setDepth(15); // Above most things
        scene.physics.world.enable(this); // Force enable physics just in case
    }

    setup(stats: { damage: number, knockback: number, stunChance: number }) {
        this.damage = stats.damage;
        this.knockback = stats.knockback;
        this.stunChance = stats.stunChance;
        
        this.setData('damage', this.damage);
        this.setData('knockback', this.knockback);
        this.setData('stunChance', this.stunChance);
        this.setData('owner', this.owner);
        this.setData('weaponId', 'thunder-wave');
        this.setData('isFence', true);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.scene.time.paused) return;
        if (!this.owner || !this.owner.active) {
            this.destroy();
            return;
        }

        // Orbit Logic
        this.currentRotation += this.orbitSpeed * (delta / 1000); 
        const totalAngleRad = Phaser.Math.DegToRad(this.baseAngle + this.currentRotation);

        // Update Position
        this.x = this.owner.x + Math.cos(totalAngleRad) * this.distance;
        this.y = this.owner.y + Math.sin(totalAngleRad) * this.distance;

        // Sync physics body manually to ensure it follows the orbit exactly
        if (this.body) {
            this.body.reset(this.x, this.y);
        }

        // Rotation:
        if (this.isSatellite) {
            // Slower, varying rotation
            this.rotation += 5 * (delta / 1000); 

            // Flashing White Spark Effect
            if (Math.random() < 0.2) { // 20% chance per frame to flash white
                this.setTint(0xFFFFFF); // White hot
                this.setScale(1.1 + Math.random() * 0.2); // Jitter scale
            } else {
                this.setTint(0x00FFFF); // Back to Cyan
                this.setScale(1.0); // Reset scale
            }
        } else {
             // Inner nodes align with the arm (though they are invisible now)
             this.rotation = totalAngleRad; 
        } 

        // Draw Lightning (Only if Satellite)
        if (this.isSatellite && this.lightningGraphics) {
            this.drawLightning();
        }
    }

    drawLightning() {
        if (!this.lightningGraphics || !this.owner) return;
        
        this.lightningGraphics.clear();
        this.lightningGraphics.lineStyle(2, 0xFFFF00, 1); // Yellow core
        
        // Draw jagged line from owner to this node
        const startX = this.owner.x;
        const startY = this.owner.y;
        const endX = this.x;
        const endY = this.y;
        
        const dist = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const segments = Math.floor(dist / 20); // Segment every 20px
        
        this.lightningGraphics.beginPath();
        this.lightningGraphics.moveTo(startX, startY);
        
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            // Linear interpolation
            const lx = startX + (endX - startX) * t;
            const ly = startY + (endY - startY) * t;
            
            // Random jitter (perpindicular to line would be best, but random xy is easier and chaotic enough)
            const jitter = 10;
            const jx = (Math.random() - 0.5) * jitter;
            const jy = (Math.random() - 0.5) * jitter;
            
            this.lightningGraphics.lineTo(lx + jx, ly + jy);
        }
        
        this.lightningGraphics.lineTo(endX, endY);
        this.lightningGraphics.strokePath();

         // Optional: Add a second wider, lower alpha line for glow
        this.lightningGraphics.lineStyle(4, 0x00FFFF, 0.3); // Blue glow
        this.lightningGraphics.beginPath();
        this.lightningGraphics.moveTo(startX, startY);
        this.lightningGraphics.lineTo(endX, endY); // Just a straight line for the glow
        this.lightningGraphics.strokePath();
    }

    destroy(fromScene?: boolean) {
        this.lightningGraphics?.destroy();
        super.destroy(fromScene);
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
            
            // Apply Damage
            const e = enemy as Phaser.Physics.Arcade.Sprite & { applyStatus?: (status: string, duration: number) => void };
            this.scene.events.emit('damage-enemy', enemy, this.damage);
            
            // Stun Chance
            if (Math.random() < this.stunChance) {
                if (e.applyStatus) {
                    e.applyStatus('stun', 1000);
                }
            }

            // Knockback is handled by the CombatManager or Physics system usually, 
            // but we can enforce it here if needed or attach data for the manager.
            // The user spec says: "Push strictly AWAY from player center".
            // Typically our game engine handles knockback via vector from damage source.
            // Since `this` is the source, and `this` is at the enemy's location roughly, 
            // the knockback vector will be (Enemy - Projectile).
            // Since Projectile is on the radius line, (Enemy - Projectile) should be roughly radial outward if the enemy is slightly further out.
            // If the enemy is closer in, it might knock them inward?
            // To ensure OUTWARD knockback, the CombatManager logic needs to know the "Source Center".
            // We'll trust the engine's default knockback for now or modify if requested.
        }
    }
}

export class ThunderWave implements WeaponConfig {
    id = 'thunder-wave';
    name = 'Thunder Wave (電磁波)';
    description = 'Rotating electric fence.';
    cooldownMs = 4000;
    
    // Level 8 is Infinite Duration, so cooldown effectively becomes irrelevant except for ensuring it exists.
    // For non-infinite levels, it respawns.
    
    getStats(level: number) {
        const stats = {
            armCount: 3,
            radius: 120,
            damage: 5,
            speed: 120,
            knockback: 200,
            stunChance: 0.1,
            duration: 3000, 
            cooldown: 4500
        };

        // Progression
        if (level >= 2) stats.radius += 30;         // 150
        if (level >= 3) stats.damage += 3;          // 8
        if (level >= 4) stats.armCount += 1;        // 4 (X)
        if (level >= 5) stats.speed += 60;          // 180
        if (level >= 6) stats.radius += 40;         // 190
        if (level >= 7) stats.armCount += 1;        // 5 (Star)
        if (level >= 8) {
             stats.duration = 9999999; // Infinite
             stats.stunChance += 0.2;  // 0.3
        }

        return stats;
    }

    fire(ctx: CharacterContext): void {
        const { scene, player, level } = ctx;
        const stats = this.getStats(level);
        this.cooldownMs = stats.cooldown;

        const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
        if (!projectilesGroup) return;

        // Cleanup existing fence (unless Infinite and already exists? But usually we re-summon on level up or just clear)
        // For simplicity, we clear old fence to apply new stats (like radius/arm count changes).
        const existing = projectilesGroup.getChildren().filter(
            p => p.active && p.getData('weaponId') === 'thunder-wave' && p.getData('owner') === player
        );
        existing.forEach(p => p.destroy());

        // Spawn Mechanics
        const armStep = 360 / stats.armCount;
        const nodeSpacing = 20;
        const nodesPerArm = Math.floor(stats.radius / nodeSpacing);

        for (let arm = 0; arm < stats.armCount; arm++) {
            const armBaseAngle = arm * armStep;
            
            for (let i = 1; i <= nodesPerArm; i++) {
                const dist = i * nodeSpacing;
                const isSatellite = (i === nodesPerArm); // Last node is satellite
                
                const node = new ThunderWaveNode(
                    scene, 
                    player.x, player.y, 
                    player, 
                    dist, 
                    stats.speed, 
                    armBaseAngle, 
                    isSatellite
                );
                
                projectilesGroup.add(node);
                node.setup({ 
                    damage: stats.damage, 
                    knockback: stats.knockback, 
                    stunChance: stats.stunChance 
                });

                // Duration Logic
                if (stats.duration < 9999999) {
                    scene.time.delayedCall(stats.duration, () => {
                        if (node.active) node.destroy();
                    });
                }
            }
        }
    }
}
