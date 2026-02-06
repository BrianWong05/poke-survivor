import Phaser from 'phaser';

interface AnimationConfig {
  tileset: string;
  startId: number;
  frameCount: number;
  duration: number;
  timer: number;
}

export class TileAnimator {
  private animations: AnimationConfig[] = [];

  constructor() {}

  public addAnimation(tileset: string, startId: number, frameCount: number, duration: number): void {
    console.log(`[TileAnimator] Registering animation for ${tileset}: GIDs ${startId}-${startId + frameCount - 1}`);
    this.animations.push({
      tileset,
      startId,
      frameCount,
      duration,
      timer: 0,
    });
  }

  public update(delta: number, layer: Phaser.Tilemaps.TilemapLayer): void {
    if (!layer || !layer.active) return;

    for (const anim of this.animations) {
      anim.timer += delta;

      if (anim.timer >= anim.duration) {
        anim.timer -= anim.duration;
        this.updateLayerTiles(anim, layer);
      }
    }
  }

  private updateLayerTiles(anim: AnimationConfig, layer: Phaser.Tilemaps.TilemapLayer): void {
    layer.forEachTile((tile) => {
      if (tile.index === -1) return;

      // Robust Check: Verify the tile index falls within the specific animation range
      if (tile.index >= anim.startId && tile.index < anim.startId + anim.frameCount) {
        // Double Check: Ensure the tile belongs to the correct tileset to avoid GID collisions
        const tileset = tile.tileset;
        if (tileset && tileset.name === anim.tileset) {
            const currentOffset = tile.index - anim.startId;
            const nextOffset = (currentOffset + 1) % anim.frameCount;
            tile.index = anim.startId + nextOffset;
        }
      }
    });
  }
}
