export interface TileData {
  id: number;
  set: string; // Filename of the tileset/autoset
  type: 'tileset' | 'autoset' | 'animations';
}

export interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  palette?: TileData[]; // Palette of unique tiles
  ground: (number | TileData)[][]; // If palette exists, these are indices. If not, TileData objects (legacy/editor state)
  objects: (number | TileData)[][];
  spawnPoint?: { x: number; y: number }; // Optional grid coordinates for player spawn
}
