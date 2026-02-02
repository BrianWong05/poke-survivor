import Phaser from 'phaser';

export class Explosion extends Phaser.Physics.Arcade.Sprite {
  public damageAmount = 0; // Set by spawner
  public isCrit = false;
  private hitEnemies: Phaser.GameObjects.GameObject[] = [];
  public pierce = 9999;

  constructor(scene: Phaser.Scene, x: number, y: number, damage: number) {
    super(scene, x, y, 'effect-explosion'); 

    this.damageAmount = damage;

    // Roll for crit (50%)
    this.isCrit = Math.random() < 0.5;

    // Visuals
    if (!scene.textures.exists('effect-explosion')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xFF4500, 0.8); // Orange Red
        graphics.fillCircle(40, 40, 40);
        graphics.generateTexture('effect-explosion', 80, 80);
    }
    this.setTexture('effect-explosion');
    this.setDepth(110);
    
    // Physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const radius = 40;
    this.setBodySize(radius * 2, radius * 2);
    this.setCircle(radius);

    // Animation: Expand and fade
    this.setScale(0.1);
    this.setAlpha(1);

    scene.tweens.add({
      targets: this,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      ease: 'Quad.out',
      onComplete: () => {
        this.destroy();
      }
    });

    // Color feedback for Crit
    if (this.isCrit) {
        this.setTint(0xFF0000); // Red tint for Crit
    }
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hitEnemies.includes(enemy)) return;
    

    this.hitEnemies.push(enemy);
  }
}
