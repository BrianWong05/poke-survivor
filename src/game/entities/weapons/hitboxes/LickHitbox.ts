import Phaser from 'phaser';

export class LickHitbox extends Phaser.Physics.Arcade.Sprite {
    private damage: number;
    private duration: number;
    private paralysisChance: number;
    private hitEnemies: Set<Phaser.GameObjects.GameObject> = new Set();
    private hitCount: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        damage: number,
        duration: number,
        paralysisChance: number
    ) {
        super(scene, x, y, 'lick-hitbox'); // Will generate texture below

        // 1. Visuals: Generate Pink Texture if missing
        if (!scene.textures.exists('lick-hitbox')) {
            const graphics = scene.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0xff99bb, 0.9); // Darker/Richer Pink, less transparent
            // Draw a "pill" shape for tongue
            graphics.fillRoundedRect(0, 0, 32, 32, 15);
            graphics.generateTexture('lick-hitbox', 32, 32);
        }
        
        this.setTexture('lick-hitbox');
        this.setOrigin(0, 0.5); // Anchor Left-Center

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.damage = damage;
        this.duration = duration;
        this.paralysisChance = paralysisChance;

        const targetScaleX = width / 32;
        const targetScaleY = height / 32;

        // Start at length 0
        this.setScale(0, targetScaleY);

        // Update Physics Body
        // CRITICAL FIX: Do NOT setBodySize to target width(120), because Body scales with Sprite!
        // If we set Body to 120 and Scale to 3.75 (120/32), final Body is 450px wide!
        // We leave Body at default (32x32 matching texture) and let setScale handle final size.
        // this.setBodySize(width, height); // REMOVED
        
        // Offset: Default body is 32x32 aligned with texture.
        // Origin (0, 0.5) handles the pivot.
        // Scaling handles the dimensions.
        // We don't need manual offset if the texture is fully filled.
        
        // Animation: Shoot out and come back
        scene.tweens.add({
            targets: this,
            scaleX: targetScaleX,
            duration: this.duration * 0.4, // Fast out
            yoyo: true, // Come back
            hold: this.duration * 0.2, // Hold briefly at max extension
            ease: 'Back.out', // bouncy pop out
            onComplete: () => {
                if (this.active) this.destroy();
            }
        });
        
        // Remove the delayedCall destroy since tween handles it
        // scene.time.delayedCall(this.duration, ...) <- Removed
    }

    /**
     * Called by CombatManager when this hitbox overlaps an enemy.
     */
    public onHit(enemy: any): void {
        if (!enemy.active || this.hitEnemies.has(enemy)) return;

        this.hitEnemies.add(enemy);

        // Damage Falloff: damage * (0.85 ^ hitCount)
        const falloffMultiplier = Math.pow(0.85, this.hitCount);
        const finalDamage = Math.floor(this.damage * falloffMultiplier);
        this.hitCount++;

        // Apply Damage
        if (typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(finalDamage);
        } else {
             // Fallback for primitive enemies
             const currentHP = enemy.getData('hp') || 10;
             enemy.setData('hp', currentHP - finalDamage);
             if (currentHP - finalDamage <= 0) {
                 enemy.setActive(false);
                 enemy.setVisible(false);
             }
        }

        // NO Knockback applied here.
        // Purely damage.

        // Paralysis (Stun)
        // 0-vector knockback usually implies stopping them.
        if (this.paralysisChance > 0 && Math.random() < this.paralysisChance) {
             if (typeof enemy.applyKnockback === 'function') {
                 // 0-vector for 1000ms
                 enemy.applyKnockback(new Phaser.Math.Vector2(0, 0), 1000);
             }
        }
    }
}
