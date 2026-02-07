export interface TileData {
  id: number;
  set: string; // Filename of the tileset/autoset
  type: 'tileset' | 'autoset' | 'animations';
}

export interface SerializedLayer {
  id: string;
  name: string;
  tiles: number[][]; // Palette indices
  collision: boolean;
  locked?: boolean;
}

export interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  palette?: TileData[]; // Palette of unique tiles
  ground: (number | TileData)[][]; // Legacy field, kept for backward compatibility
  objects: (number | TileData)[][]; // Legacy field, kept for backward compatibility
  layers?: SerializedLayer[]; // New multi-layer format
  spawnPoint?: { x: number; y: number }; // Optional grid coordinates for player spawn
}
