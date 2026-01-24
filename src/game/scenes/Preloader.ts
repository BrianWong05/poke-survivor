import Phaser from 'phaser';

interface SpriteManifestEntry {
  id: string;
  name: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}

// Direction name mapping (matches sprite sheet row order)
// Standard PMD order: Down, DownRight, Right, UpRight, Up, UpLeft, Left, DownLeft
const DIRECTION_NAMES = [
  'down',       // Row 0
  'down-right', // Row 1
  'right',      // Row 2
  'up-right',   // Row 3
  'up',         // Row 4
  'up-left',    // Row 5
  'left',       // Row 6
  'down-left',  // Row 7
] as const;

export type DirectionName = (typeof DIRECTION_NAMES)[number];

export class Preloader extends Phaser.Scene {
  private manifest: SpriteManifestEntry[] = [];

  constructor() {
    super({ key: 'Preloader' });
  }

  preload(): void {
    // Show loading progress
    const width = this.scale.width;
    const height = this.scale.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x4a9eff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load manifest first as JSON
    this.load.json('manifest', 'assets/manifest.json');
  }

  create(): void {
    // Get manifest data
    this.manifest = this.cache.json.get('manifest') as SpriteManifestEntry[];

    if (!this.manifest || this.manifest.length === 0) {
      console.warn('No sprites in manifest, starting MainScene without sprites');
      this.scene.start('MainScene');
      return;
    }

    // Store manifest in registry for other scenes to access
    this.registry.set('spriteManifest', this.manifest);

    // Start loading sprites
    this.loadSprites();
  }

  private loadSprites(): void {
    // Register load callbacks
    this.load.on('complete', () => {
      this.createAnimations();
      this.scene.start('MainScene');
    });

    // Queue all spritesheets
    for (const sprite of this.manifest) {
      this.load.spritesheet(sprite.name, sprite.path, {
        frameWidth: sprite.frameWidth,
        frameHeight: sprite.frameHeight,
      });
    }

    // Start loading
    this.load.start();
  }

  private createAnimations(): void {
    for (const sprite of this.manifest) {
      // Create animation for each direction
      for (let dir = 0; dir < sprite.directions; dir++) {
        const dirName = DIRECTION_NAMES[dir] || `dir${dir}`;
        const startFrame = dir * sprite.frameCount;
        const endFrame = startFrame + sprite.frameCount - 1;

        this.anims.create({
          key: `${sprite.name}-walk-${dirName}`,
          frames: this.anims.generateFrameNumbers(sprite.name, {
            start: startFrame,
            end: endFrame,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }

      // Also create a default walk animation (down direction)
      this.anims.create({
        key: `${sprite.name}-walk`,
        frames: this.anims.generateFrameNumbers(sprite.name, {
          start: 0,
          end: sprite.frameCount - 1,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}

// Helper to get direction from velocity
export function getDirectionFromVelocity(vx: number, vy: number): DirectionName {
  if (vx === 0 && vy === 0) return 'down';

  // Calculate angle and map to 8 directions
  const angle = Math.atan2(vy, vx) * (180 / Math.PI);

  // Map angle to direction (angle 0 = right, 90 = down, etc.)
  if (angle >= -22.5 && angle < 22.5) return 'right';
  if (angle >= 22.5 && angle < 67.5) return 'down-right';
  if (angle >= 67.5 && angle < 112.5) return 'down';
  if (angle >= 112.5 && angle < 157.5) return 'down-left';
  if (angle >= 157.5 || angle < -157.5) return 'left';
  if (angle >= -157.5 && angle < -112.5) return 'up-left';
  if (angle >= -112.5 && angle < -67.5) return 'up';
  if (angle >= -67.5 && angle < -22.5) return 'up-right';

  return 'down';
}
