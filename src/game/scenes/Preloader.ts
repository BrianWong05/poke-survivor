import Phaser from 'phaser';

interface SpriteAnimation {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}

interface SpriteManifestEntry {
  id: string;
  name: string;
  animations: SpriteAnimation[];
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

    // Load Exp Candy sprites
    this.load.image('candy-s', 'assets/candies/Exp._Candy_S_SV_Sprite.png');
    this.load.image('candy-m', 'assets/candies/Exp._Candy_M_SV_Sprite.png');
    this.load.image('candy-l', 'assets/candies/Exp._Candy_L_SV_Sprite.png');
    this.load.image('candy-xl', 'assets/candies/Exp._Candy_L_SV_Sprite.png'); // Use L sprite for XL (scale up)
    this.load.image('candy-rare', 'assets/candies/Rare_Candy_SV.png');
    this.load.image('muscle_band', 'assets/items/muscle_band.png');
    this.load.image('loaded_dice', 'assets/items/loaded_dice.png');
    this.load.image('lucky_egg', 'assets/items/lucky_egg.png');
    this.load.image('amulet_coin', 'assets/items/amulet_coin.png');
    this.load.image('magnet', 'assets/items/magnet.png');
    this.load.image('hp_up', 'assets/items/hp_up.png');
    this.load.image('assault_vest', 'assets/items/assault_vest.png');
    this.load.image('leftovers', 'assets/items/leftovers.png');

    // Weapon sprites
    this.load.image('will-o-wisp', 'assets/sprites/will-o-wisp.png');
    this.load.image('petal', 'assets/sprites/petal.png');

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

    // Generate fallback textures (programmatic assets)
    this.generateFallbackTextures();

    // Start loading sprites
    this.loadSprites();
  }

  private generateFallbackTextures(): void {
    if (!this.textures.exists('projectile')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(16, 16, 16); // 32x32 white circle
      graphics.generateTexture('projectile', 32, 32);
      graphics.destroy();
    }

    if (!this.textures.exists('electric-field')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(128, 128, 128); // 256x256 white high-res circle
      graphics.generateTexture('electric-field', 256, 256);
      graphics.destroy();
    }

    if (!this.textures.exists('jagged-rock')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0x795548); // Brown Rock color
      
      // Draw a jagged polygon
      const points = [
        { x: 16, y: 0 },
        { x: 32, y: 8 },
        { x: 28, y: 24 },
        { x: 16, y: 32 },
        { x: 4, y: 24 },
        { x: 0, y: 8 }
      ];
      graphics.fillPoints(points, true, true);
      
      // Add some shading/highlights
      graphics.fillStyle(0x4E342E); // Darker shadow
      graphics.fillPoints([
        { x: 16, y: 16 },
        { x: 28, y: 24 },
        { x: 16, y: 32 },
        { x: 4, y: 24 }
      ], true, true);

      graphics.generateTexture('jagged-rock', 32, 32);
      graphics.destroy();
    }

    if (!this.textures.exists('electric-spark')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      
      const cx = 32;
      const cy = 32;

      // Layer 1: Outer Blue Glow/Jagged
      graphics.fillStyle(0x00FFFF, 0.8); 
      const spikes = 12;
      const points: {x: number, y: number}[] = [];
      
      for (let i = 0; i < spikes * 2; i++) {
        // Randomize radius for "chaotic" electric look
        const baseRadius = (i % 2 === 0) ? 28 : 10;
        const randomFactor = (Math.random() * 10) - 5; // +/- 5px jitter
        const radius = baseRadius + randomFactor;
        
        const angle = (Math.PI / spikes) * i;
        points.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius
        });
      }
      graphics.fillPoints(points, true, true);

      // Layer 2: Inner White/Bright Core
      graphics.fillStyle(0xFFFFFF, 1);
      const innerPoints: {x: number, y: number}[] = [];
      for (let i = 0; i < spikes * 2; i++) {
        const baseRadius = (i % 2 === 0) ? 14 : 5;
        const randomFactor = (Math.random() * 4) - 2;
        const radius = baseRadius + randomFactor;
        
        const angle = (Math.PI / spikes) * i;
        innerPoints.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius
        });
      }
      graphics.fillPoints(innerPoints, true, true);

      graphics.generateTexture('electric-spark', 64, 64);
      graphics.destroy();
    }
  }

  private loadSprites(): void {
    // Register load callbacks
    this.load.on('complete', () => {
      this.createAnimations();
      this.scene.start('MainScene');
    });

    // Queue all spritesheets
    // Queue all spritesheets
    for (const sprite of this.manifest) {
      for (const anim of sprite.animations) {
        this.load.spritesheet(`${sprite.name}-${anim.key}`, anim.path, {
          frameWidth: anim.frameWidth,
          frameHeight: anim.frameHeight,
        });
      }
    }

    // Start loading
    this.load.start();
  }

  private createAnimations(): void {
    // Define enemy names for faster animation
    const enemyNames = ['rattata', 'geodude', 'zubat'];

    for (const sprite of this.manifest) {
      const isEnemy = enemyNames.includes(sprite.name);
      const frameRate = isEnemy ? 12 : 8;

      for (const anim of sprite.animations) {
        const textureKey = `${sprite.name}-${anim.key}`;

        // Create animation for each direction
        for (let dir = 0; dir < anim.directions; dir++) {
          const dirName = DIRECTION_NAMES[dir] || `dir${dir}`;
          const startFrame = dir * anim.frameCount;
          const endFrame = startFrame + anim.frameCount - 1;

          this.anims.create({
            key: `${sprite.name}-${anim.key}-${dirName}`,
            frames: this.anims.generateFrameNumbers(textureKey, {
              start: startFrame,
              end: endFrame,
            }),
            frameRate: frameRate,
            repeat: -1,
          });
        }
      }

      // Default walk animation alias (if walk exists)
      const walkAnim = sprite.animations.find(a => a.key === 'walk');
      if (walkAnim) {
         this.anims.create({
          key: `${sprite.name}-walk`,
          frames: this.anims.generateFrameNumbers(`${sprite.name}-walk`, {
            start: 0,
            end: walkAnim.frameCount - 1,
          }),
          frameRate: frameRate,
          repeat: -1,
        });
      }
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
