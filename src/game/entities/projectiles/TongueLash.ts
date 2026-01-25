import Phaser from 'phaser';
import type { Enemy } from '@/game/entities/enemies/Enemy';

export class TongueLash extends Phaser.Physics.Arcade.Sprite {
    private damage: number;
    private isDreamEater: boolean;
    private hitEnemies: Set<Phaser.GameObjects.GameObject> = new Set();
    private totalHealed: number = 0;
    private maxHealPerCast: number = 10;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        rotation: number,
        damage: number,
        isDreamEater: boolean
    ) {
        super(scene, x, y, 'projectile-tongue'); // Will generate texture below

        // Generate texture if missing
        if (!scene.textures.exists('projectile-tongue')) {
            const graphics = scene.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0xffffff, 1);
            graphics.fillRect(0, 0, 32, 32); // 32x32 white square
            graphics.generateTexture('projectile-tongue', 32, 32);
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.damage = damage;
        this.isDreamEater = isDreamEater;

        // Visuals
        this.setTexture('projectile-tongue');
        this.setRotation(rotation);
        
        // Origin at left-center so it extends outward from player
        this.setOrigin(0, 0.5);

        if (isDreamEater) {
            this.setTint(0x800080); // Purple
            // Huge range: 200px.
            // Texture is 32px. 200 / 32 ~= 6.25 scale X.
            // Y scale can be thicker? 
            // Prompt says: "Level 8+ ... range 200px".
            // Previous prompt for Lick: "Pink... scaled x: 3, y: 0.5". (3 * 32 = 96px).
            // Lick range 80px. 3 * 32 = 96 close enough.
            // Dream Eater 200px. 200 / 32 = 6.25.
            this.setScale(6.25, 1.5);
        } else {
            this.setTint(0xFFC0CB); // Pink
            // Lick range 80px.
            // Prompt says: "Use a simple Pink Rectangle... scaled x: 3, y: 0.5".
            this.setScale(3, 0.5);
        }

        this.setAlpha(0.8);
        this.setDepth(20); // Above enemies

        // Physics Body
        // Needs to match the visual rect.
        // Update body size from scale.
        // Origin (0, 0.5) adjustment.
        // Arcade physics bodies are AABB. Rotating the sprite rotates the visual, 
        // usually need to adjust body or use circular/hitbox?
        // Note: Arcade Physics Body DOES NOT ROTATE. It stays axis-aligned.
        // For a directional melee attack that rotates, using a detailed body is tricky in Arcade.
        // However, if we just want a box that covers the area roughly, we can setSize.
        // But if I attack diagonally, AABB is a big square covering everything.
        // For accurate rotated hitboxes in Phaser Arcade, we usually use `scene.physics.velocityFromRotation` 
        // with a small projectile or multiple bodies, OR just accept AABB inaccuracy.
        // OR: Since it acts instantly (150ms), maybe we handle overlap manually using geometry?
        // But user asked for `Phaser.Physics.Arcade.Sprite` and `scene.physics.add.overlap`.
        // We will accept AABB limitations. The box will be wide and tall if rotated.
        // Actually, if we set body size to allow overlap, it might be fine.
        // Let's set the body size to match the scaled dimensions.
        // If angle is 0 (right), w=scaleX*32, h=scaleY*32.
        // If angle is 90 (down), w=scaleY*32, h=scaleX*32.
        // We can manually resize the body based on rotation in constructor.
        
        // width/height unused for now as we use setCircle and AABB defaults.
        // const width = this.scaleX * 32;
        // const height = this.scaleY * 32;

        this.setOrigin(0.5, 0.5);

        // Body size
        // Since Lick is now strictly horizontal, we can use a precise rectangular body.
        const width = this.scaleX * 32;
        const height = this.scaleY * 32;

        // Set body size to match visual dimensions
        // Arcade Physics body is unscaled by default, so we set exact dimensions.
        this.setBodySize(width, height);

        // Adjust offset. 
        // setBodySize centers the body on the sprite (top-left of body to top-left of sprite frame if origin 0,0).
        // Our sprite has origin 0.5, 0.5.
        // Phaser Arcade Physics aligns the body top-left with the *texture* top-left usually, or centers it if we use center?
        // Actually, setBodySize resets offset. We need to center it.
        // Offset is relative to the top-left of the sprite texture (before scale).
        // Wait, body size is independent of sprite scale visually.
        // If we want body to match scaled sprite:
        // Sprite is at X,Y with origin 0.5.
        // Body needs to be centered on X,Y.
        // Body x = Sprite.x - width/2.
        // Phaser: body.offset.x handles relative position to game object.
        // Default setBodySize centers it? No, usually defaults to 0,0 (top left).
        // We often need `this.setOffset(x, y)`.
        
        // However, `updateFromGameObject()` might handle it if we trust it?
        // Let's do it manually for precision.
        // We want the body centered on the sprite's center.
        // Offset is relative to the unscaled texture? No, relative to the GameObject position?
        // Actually for Arcade Sprite, offset is into the texture frame?
        // Let's try centered offset calculation.
        // The texture is 32x32.
        // We want the body to be `width` wide.
        // This is much larger than texture.
        // Arcade Physics body can be larger than texture.
        
        // Center the body:
        // OffsetX = (TextureWidth - BodyWidth) / 2
        // OffsetY = (TextureHeight - BodyHeight) / 2
        // If width = 96 (scale 3), texture 32. Offset = (32 - 96) / 2 = -32.
        this.setOffset((32 - width) / 2, (32 - height) / 2);

        // Debug: Visualize body if debug enabled (handled by Phaser usually)


        // Lifetime
        scene.time.delayedCall(150, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }

    public handleOverlap(enemyObject: Phaser.GameObjects.GameObject): void {
        const enemy = enemyObject as Enemy;
        if (!enemy.active || enemy.isDying || this.hitEnemies.has(enemy)) return;

        this.hitEnemies.add(enemy);

        // Calculate damage and effects
        let finalDamage = this.damage;

        if (this.isDreamEater && enemy.isParalyzed) {
            // Dream Eater Combo
            finalDamage = 100; // Double damage (base 50 * 2)
            
            // Heal Player
            this.healPlayer();
        }

        // Apply Status (Lick only? Spec: "Lick... 30% Paralysis". Dream Eater? Spec: "Dream Eater... Combo Mechanic...".
        // Does Dream Eater still apply Paralysis?
        // Spec says Dream Eater: "Damage 50... Combo Mechanic...". It doesn't explicitly say "Also has 30% paralysis chance".
        // But usually evolutions keep base effects or upgrade them.
        // However, the combo relies on "already Paralyzed". 
        // If not paralyzed, does it paralyze? 
        // Spec implies Dream Eater is for Damage/Sustain. Lick is for CC.
        // Requirement "Dream Eater Attack": "Deals 50 base damage".
        // It doesn't mention paralysis chance.
        // Requirement "Lick": "30% chance".
        // I will assume Dream Eater loses the paralysis chance in favor of Damage/Heal, OR retains it?
        // Prompt for Lick: "Effect: 30% Paralysis chance."
        // Prompt for Dream Eater: "The Combo Mechanic...".
        // I'll err on side of "Lick applies paralysis, Dream Eater consumes/exploits it". 
        // Wait, if Dream Eater replaces Lick, and doesn't paralyze, you can't combo unless you have another source?
        // "If the enemy is already Paralyzed".
        // Maybe Dream Eater also paralyzes?
        // To be safe/playable, Dream Eater should probably also paralyze if it fails to combo?
        // But strictly following prompt: Level 1-7 has chance. Level 8+ has Combo.
        // It doesn't explicitly remove paralysis chance.
        // "Level 8+ (Evolution...): Damage 50. The Combo Mechanic..."
        // Usually implied "Changes: ...".
        // I'll keep the paralysis chance for Dream Eater too if not consuming?
        // Or maybe purely damage.
        // Let's assume Dream Eater ALSO has the paralysis chance if strict upgrade.
        // "Effect: 30% Paralysis chance" listed under Level 1-7.
        // Level 8+ section lists new stats.
        // I will INCLUDE paralysis chance for Dream Eater as well (~30%) to ensure self-sufficiency, 
        // otherwise a single weapon run is impossible.
        const roll = Math.random();
        // If we didn't combo (enemy wasn't paralyzed), try to paralyze?
        // Or always try to paralyze?
        if (roll < 0.3) {
            enemy.paralyze(2000);
        }

        enemy.takeDamage(finalDamage);
    }

    private healPlayer(): void {
        if (this.totalHealed >= this.maxHealPerCast) return;
        
        const healAmount = 2;
        this.totalHealed += healAmount;
        
        // Emit heal event
        this.scene.events.emit('player:heal', healAmount);
    }
}
