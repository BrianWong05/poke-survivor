import Phaser from 'phaser';
import { TileAnimator } from '@/game/utils/TileAnimator';
import { TILE_ANIMATIONS } from '@/game/config/TileAnimations';

export class LevelEditorScene extends Phaser.Scene {
  private tileAnimator!: TileAnimator;
  private groundLayer?: Phaser.Tilemaps.TilemapLayer;
  private objectsLayer?: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'LevelEditorScene' });
  }

  create(): void {
    console.log('LevelEditorScene started');
    
    // 1. Initialize TileAnimator
    this.tileAnimator = new TileAnimator();
    
    // 2. Register animations from config
    TILE_ANIMATIONS.forEach(anim => {
        // Note: LevelEditorScene is a test scene using 'Outside.png' directly.
        // We assume animations are relative to this tileset or generic.
        // In a real scenario, we'd resolve GIDs properly like MapManager.
        // For this test scene, we just register them as-is if they match the loaded tileset.
        this.tileAnimator.addAnimation(anim.tileset, anim.startId, anim.frameCount, anim.duration);
    });

    // 3. Setup Test Map
    // Create a simple map to visualize the animations
    const map = this.make.tilemap({ width: 20, height: 20, tileWidth: 32, tileHeight: 32 });
    
    // Attempt to use the standard tileset
    // Note: 'Outside.png' must be loaded in Preloader
    const tileset = map.addTilesetImage('Outside.png', 'Outside.png');
    
    if (tileset) {
      this.groundLayer = map.createBlankLayer('Ground', tileset) || undefined;
      this.objectsLayer = map.createBlankLayer('Objects', tileset) || undefined;
      
      if (this.groundLayer) {
        // Fill background with grass or something (id 4? assuming generic)
        // Let's just place specific animated tiles
        
        // Flower sequence (0, 1, 2, 3)
        this.groundLayer.putTileAt(0, 2, 2); 
        this.add.text(64, 40, 'Flower (0-3)', { fontSize: '12px' });

        // Water sequence (200, 201, 202, 203)
        this.groundLayer.putTileAt(200, 2, 4);
        this.add.text(64, 128 + 10, 'Water (200-203)', { fontSize: '12px' });
      }
      
      if (this.objectsLayer) {
        // Seaweed sequence (100, 101, 102, 103)
        this.objectsLayer.putTileAt(100, 2, 6);
        this.add.text(64, 192 + 10, 'Seaweed (100-103)', { fontSize: '12px' });
      }

      this.cameras.main.setZoom(2);
      this.cameras.main.centerOn(100, 100);
      
    } else {
      console.warn('Tileset Outside.png not found');
    }

    // Instructions
    this.add.text(10, 10, 'Level Editor Scene (Test)', { color: '#ffffff' }).setScrollFactor(0);
    this.add.text(10, 30, 'Press ESC to return', { color: '#aaaaaa', fontSize: '12px' }).setScrollFactor(0);

    // Input to return
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('MainScene');
    });
  }

  update(_time: number, delta: number): void {
    this.tileAnimator.preUpdate(delta);
    if (this.groundLayer) {
      this.tileAnimator.updateLayer(this.groundLayer);
    }
    if (this.objectsLayer) {
      this.tileAnimator.updateLayer(this.objectsLayer);
    }
  }
}
