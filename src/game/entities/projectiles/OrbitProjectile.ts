import Phaser from 'phaser';

export class OrbitProjectile extends Phaser.Physics.Arcade.Sprite {
  private parentEntity: { x: number; y: number; active: boolean };
  private radius: number;
  private orbitSpeed: number; // radians per second
  private angleValue: number; // current angle in radians

  constructor(
    scene: Phaser.Scene,
    x: number, // Start x (will be overwritten by update logic essentially, but good for init)
    y: number, // Start y
    texture: string,
    parentEntity: { x: number; y: number; active: boolean },
    radius: number,
    orbitSpeed: number, // degrees per second
    startAngleDeg: number = 0
  ) {
    super(scene, x, y, texture);

    this.parentEntity = parentEntity;
    this.radius = radius;
    this.orbitSpeed = Phaser.Math.DegToRad(orbitSpeed);
    this.angleValue = Phaser.Math.DegToRad(startAngleDeg);

    // Initial Position calculation to prevent single-frame jump
    this.updatePosition();

    // Required for Phaser
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // This projectile is controlled manually, so we don't let physics move it via velocity
    // However, we want the body to exist for collision checks.
    // Setting immediate position updates.
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (!this.parentEntity.active) {
      this.destroy();
      return;
    }

    // Update angle: speed (rad/s) * delta (ms) / 1000
    this.angleValue += this.orbitSpeed * (delta / 1000);

    this.updatePosition();
  }

  private updatePosition(): void {
    this.x = this.parentEntity.x + Math.cos(this.angleValue) * this.radius;
    this.y = this.parentEntity.y + Math.sin(this.angleValue) * this.radius;

    // Rotate sprite to face direction of movement (tangent)
    // Tangent is perpendicular to radius (angle + 90 deg)
    // Adjust +/- based on speed direction if needed, but standard is +90 for CCW
    // If speed is negative (CW), we might want to flip?
    // User requested: "Ensure the sprite rotates to face the direction of the spin."
    // If spinning CCW (positive speed), facing is angle + PI/2.
    // If spinning CW (negative speed), facing is angle - PI/2.
    const tangentOffset = this.orbitSpeed >= 0 ? Math.PI / 2 : -Math.PI / 2;
    this.setRotation(this.angleValue + tangentOffset);
  }
}
