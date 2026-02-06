import { getAutoTileId } from '@/game/utils/AutoTileTable';

export class AutoTiler {
  // Updates a tile and its 8 neighbors
  static updateTileRecursive(
    layer: Phaser.Tilemaps.TilemapLayer,
    x: number,
    y: number,
    _tileTypeIndex: number
  ) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        this.refreshSingleTile(layer, x + dx, y + dy, _tileTypeIndex);
      }
    }
  }

  private static refreshSingleTile(
    layer: Phaser.Tilemaps.TilemapLayer,
    x: number,
    y: number,
    baseIndex: number
  ) {
    const tile = layer.getTileAt(x, y);
    // Only update if this tile exists and is part of the same "Auto Tile Set"
    // For now, we assume ANY tile is part of the set.
    // In a real app, you'd check: if (tile.properties.type !== 'ground') return;
    if (!tile) return;
    
    // Check if the tile is within the autotile range of this set
    // (Assuming 47 tiles standard)
    if (tile.index < baseIndex || tile.index >= baseIndex + 47) return;

    const check = (cx: number, cy: number) => {
      const t = layer.getTileAt(cx, cy);
      // Return true if neighbor exists AND is part of the same set
      return !!t && (t.index >= baseIndex && t.index < baseIndex + 47);
    };

    const autoId = getAutoTileId(
      check(x, y - 1),
      check(x + 1, y - 1),
      check(x + 1, y),
      check(x + 1, y + 1),
      check(x, y + 1),
      check(x - 1, y + 1),
      check(x - 1, y),
      check(x - 1, y - 1)
    );

    // Apply the new ID (We assume the autotile set starts at 'tileTypeIndex')
    // If your generated texture is the *only* thing in the tileset, just use autoId.
    // If it's part of a larger set, add an offset: tileTypeIndex + autoId
    layer.putTileAt(autoId, x, y);
  }
}
