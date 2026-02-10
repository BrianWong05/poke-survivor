
import { MAP_WIDTH, MAP_HEIGHT } from '../constants.js';

export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function createEmptyLayer(width: number, height: number, defaultValue: number): number[][] {
  const layer = [];
  for (let y = 0; y < height; y++) {
    layer.push(new Array(width).fill(defaultValue));
  }
  return layer;
}

export function isAreaFree(
  startX: number, 
  startY: number, 
  width: number, 
  height: number, 
  layer: number[][],
  groundTiles: number[][],
  waterIndex: number
): boolean {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
      if (layer[y][x] !== -1) return false;
      if (groundTiles[y][x] === waterIndex) return false;
    }
  }
  return true;
}
