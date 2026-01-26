import Phaser from 'phaser';

export class InputManager {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private joystickVector = { x: 0, y: 0 };
  private togglePauseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public setup(onTogglePause: () => void): void {
    this.togglePauseCallback = onTogglePause;

    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      // Ultimate trigger (Space)
      this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      // Pause toggle (ESC)
      this.scene.input.keyboard.on('keydown-ESC', () => {
        if (this.togglePauseCallback) {
            this.togglePauseCallback();
        }
      });
    }
  }

  public setJoystickVector(x: number, y: number): void {
    this.joystickVector.x = x;
    this.joystickVector.y = y;
  }

  public isUltimateTriggered(): boolean {
      return this.spaceKey?.isDown;
  }

  public getMovementVector(): { x: number, y: number } {
      let velocityX = 0;
      let velocityY = 0;

      // Keyboard input
      if (this.cursors?.left?.isDown || this.wasd?.A?.isDown) {
        velocityX -= 1;
      }
      if (this.cursors?.right?.isDown || this.wasd?.D?.isDown) {
        velocityX += 1;
      }
      if (this.cursors?.up?.isDown || this.wasd?.W?.isDown) {
        velocityY -= 1;
      }
      if (this.cursors?.down?.isDown || this.wasd?.S?.isDown) {
        velocityY += 1;
      }

      // Add joystick input
      velocityX += this.joystickVector.x;
      velocityY += this.joystickVector.y;

      // Normalize if diagonal
      const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (length > 1) {
        velocityX /= length;
        velocityY /= length;
      }

      return { x: velocityX, y: velocityY };
  }
}
