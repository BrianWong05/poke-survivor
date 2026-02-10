
export interface Point {
  x: number;
  y: number;
}

export interface TileData {
  id: number;
  set: string;
  type: 'tileset' | 'autoset' | 'animations';
}

export interface SerializedLayer {
  name: string;
  tiles: number[][]; // or flat array if you prefer, but 2D is easier for generation
  visible: boolean;
  opacity: number;
  locked: boolean;
}

export interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  palette: TileData[];
  ground: number[][];
  objects: number[][];
  decorations: number[][]; // New layer
  spawnPoint: Point;
}
