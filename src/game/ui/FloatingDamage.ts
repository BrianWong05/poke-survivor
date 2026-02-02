import Phaser from 'phaser';

export class FloatingDamage extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, amount: number) {
        // Style: White text, bold, small black stroke for readability
        super(scene, x, y, Math.round(amount).toString(), { 
            fontSize: '16px', 
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });

        scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        // Ensure above enemy sprites (assuming sprites are < 100)
        this.setDepth(100);

        // Animation: Float Up + Fade Out
        scene.tweens.add({
            targets: this,
            y: y - 40,       // Move up 40 pixels
            alpha: 0,        // Fade to invisible
            duration: 600,   // Takes 600ms
            ease: 'Power1',
            onComplete: () => {
                this.destroy(); // Clean up memory
            }
        });
    }
}
