export interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  ground: number[][]; // Grid of tile IDs for ground
  objects: number[][]; // Grid of tile IDs for objects
}
