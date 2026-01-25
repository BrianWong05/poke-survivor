import Phaser from 'phaser';

export class BurningGround extends Phaser.Physics.Arcade.Sprite {
  public damagePerTick = 3;
  public tickRate = 500;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-fireball'); // Using white circle texture

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visuals
    this.setTint(0xff4500); // Red-Orange
    this.setAlpha(0.7);
    this.setScale(4, 2); // Flattened ellipse (64x32 approx)
    
    // Physics
    this.setImmovable(true);
    // Explicitly set circular body to match the width roughly, but flattened? 
    // Arcade physics bodies are axis-aligned rectangles or circles. ellipse is not supported strictly.
    // A circle body or rect body is fine. 
    // Since visual is 64x32, a circle of radius 16scaled? 
    // Default body matches texture size (16x16) * scale (4x2) = 64x32 rect.
    // That's fine for an area hazard.
    
    // Lifetime
    scene.time.delayedCall(3000, () => {
        if (this.active) this.destroy();
    });
  }
}
