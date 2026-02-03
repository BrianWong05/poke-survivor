import Phaser from 'phaser';
import { Player } from '../entities/Player';

export class InventoryDisplay extends Phaser.GameObjects.Container {
    private iconSize = 32;
    private padding = 4;
    private weaponGroup: Phaser.GameObjects.Group;
    private passiveGroup: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene.add.existing(this);
        
        // Groups to manage icons so we can clear them easily
        // Note: Groups usually manage GameObjects in the scene. 
        // We want them as children of this container.
        // Phaser Groups don't automatically parent to Containers. 
        // We will just manage add/destroy manually using the group for reference or just clear current children.
        // Simplified: Just keep reference to children in groups for easy clearing.
        this.weaponGroup = this.scene.add.group();
        this.passiveGroup = this.scene.add.group();
        
        // Important: Items in group must ALSO be added to this container to move with it.
    }

    refresh(player: Player) {
        // Clear previous icons from groups AND existing container
        this.weaponGroup.clear(true, true);
        this.passiveGroup.clear(true, true);
        this.removeAll(true); // Clear container children

        // 1. Render Weapons (Row 1)
        const weapons = player.inventory.weapons || [];
        weapons.forEach((weapon, index) => {
            // Determine sprite key. Debug weapons might not have spriteKey, try ID.
            const key = weapon.spriteKey || weapon.id;
            this.createIcon(key, weapon.level, index, 0, this.weaponGroup);
        });

        // 2. Render Passives (Row 2)
        const passives = player.inventory.passives || [];
        passives.forEach((item, index) => {
             // Passives usually have spriteKey in config, or use ID.
             // Item class doesn't strictly have spriteKey on interface, need to check data or fallback.
             // We can check ItemData registry or try ID.
             // For now, assuming ID matches sprite key or is aliased.
             const key = (item as any).spriteKey || item.id;
             this.createIcon(key, item.level, index, 1, this.passiveGroup);
        });
    }

    private createIcon(key: string, level: number, index: number, row: number, group: Phaser.GameObjects.Group) {
        const x = index * (this.iconSize + this.padding);
        const y = row * (this.iconSize + this.padding);

        // Background (optional dark square)
        const bg = this.scene.add.rectangle(x, y, this.iconSize, this.iconSize, 0x000000, 0.5).setOrigin(0, 0);
        this.add(bg);
        group.add(bg);

        // Check if texture exists, else fallback
        let textureKey = key;
        if (!this.scene.textures.exists(key)) {
            // Fallback for weapons or items without explicit sprite
            // Use 'projectile' for weapons, or just show text?
            // Let's try to map some common IDs if needed, or use a default.
            textureKey = 'projectile'; // Default placeholder
            if (row === 1) textureKey = 'candy-s'; // Default for passives? Or just empty.
            
            // Allow explicit overrides if needed logic matches
        }

        // Icon
        const icon = this.scene.add.image(x + this.iconSize/2, y + this.iconSize/2, textureKey);
        icon.setDisplaySize(this.iconSize - 4, this.iconSize - 4);
        this.add(icon);
        group.add(icon);

        // Level Text (e.g., "Lv 2")
        // Only show if level > 1, or always? User requested "Show a small text number".
        // Let's show for all valid items.
        // Level Text (e.g., "Lv 2")
        // Show level if >= 1
        if (level > 0) {
            const text = this.scene.add.text(x + this.iconSize - 2, y + this.iconSize - 2, `${level}`, {
                fontSize: '12px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            });
            text.setOrigin(1, 1);
            this.add(text);
            group.add(text);
        }
    }
}
