
import { MAP_WIDTH, MAP_HEIGHT } from '../constants.js';
import { randomInt } from '../utils/common.js';

export function generateFlowers(
  groundTiles: number[][],
  objectTiles: number[][], 
  decorationTiles: number[][], 
  grassIndex: number, 
  flowerIndices: number[] 
) {
  // Scatter flowers
  const numFlowers = 1000;
  
  for (let i = 0; i < numFlowers; i++) {
      const x = randomInt(MAP_WIDTH);
      const y = randomInt(MAP_HEIGHT);

      // Only place on grass, and ensure no object is already there
      if (
        groundTiles[y][x] === grassIndex && 
        decorationTiles[y][x] === -1 &&
        objectTiles[y][x] === -1
      ) {
          // Pick random flower tile
          const flowerTile = flowerIndices[randomInt(flowerIndices.length)];
          decorationTiles[y][x] = flowerTile;
      }
  }
}
