import Phaser from 'phaser';

export class FloatingHpBar {
  private bar: Phaser.GameObjects.Graphics;
  private target: { x: number, y: number };
  private width: number = 50;
  private height: number = 5;
  private offsetY: number = 25;

  constructor(scene: Phaser.Scene, target: { x: number, y: number }) {
    this.target = target;
    this.bar = scene.add.graphics();
    this.bar.setDepth(100); // Ensure it's above most entities
  }

  /**
   * Redraw the HP bar based on current health values.
   */
  public draw(currentHp: number, maxHp: number): void {
    if (!this.bar || !this.bar.scene) return;

    this.bar.clear();

    // Background (Border/Empty area)
    this.bar.fillStyle(0x000000, 0.8);
    this.bar.fillRect(0, 0, this.width, this.height);

    // Foreground (Health)
    if (currentHp > 0 && maxHp > 0) {
      const safeMaxHp = Math.max(1, maxHp);
      const ratio = Math.max(0, Math.min(1, currentHp / safeMaxHp));
      const healthWidth = ratio * this.width;
      
      // Color: Red
      const color = 0xff0000;

      this.bar.fillStyle(color, 1);
      this.bar.fillRect(0, 0, healthWidth, this.height);
    }
  }

  /**
   * Sync the position of the graphics object with the target entity.
   */
  public update(): void {
    if (!this.bar || !this.bar.scene) return;
    
    this.bar.x = this.target.x - (this.width / 2);
    // Position below the player (assuming center origin)
    this.bar.y = this.target.y + this.offsetY;
  }

  /**
   * Clean up resources.
   */
  public destroy(): void {
    this.bar.destroy();
  }
}
