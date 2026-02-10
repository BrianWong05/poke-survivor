
import { MAP_WIDTH, MAP_HEIGHT, MARKERS } from '../constants.js';
import { getAutoTileId } from '../utils/auto-tile.js';
import { generateBlob, smoothMap } from '../utils/algorithms.js';
import { randomInt } from '../utils/common.js';

export function generateLakes(groundTiles: number[][], palette: any[], getPaletteIndex: any) {
  const TEMP_WATER_MARKER = MARKERS.WATER;

  // Large Lakes
  generateBlob(groundTiles, MAP_WIDTH, MAP_HEIGHT, TEMP_WATER_MARKER, 2 + randomInt(2), 2000, 3500, []);

  // Medium Lakes
  generateBlob(groundTiles, MAP_WIDTH, MAP_HEIGHT, TEMP_WATER_MARKER, 3 + randomInt(3), 800, 1500, []);

  // Small Ponds
  generateBlob(groundTiles, MAP_WIDTH, MAP_HEIGHT, TEMP_WATER_MARKER, 5 + randomInt(5), 150, 500, []);
}

export function smoothWater(groundTiles: number[][], grassIndex: number) { 
   const marker = MARKERS.WATER;
   smoothMap(groundTiles, MAP_WIDTH, MAP_HEIGHT, marker, 2, grassIndex);
}

export function resolveWaterTiles(groundTiles: number[][], getPaletteIndex: any) {
    const TEMP_WATER_MARKER = MARKERS.WATER;
    const waterSet = new Set<string>();
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_WATER_MARKER) {
                waterSet.add(`${x},${y}`);
            }
        }
    }
    
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_WATER_MARKER) {
                const isWater = (nx: number, ny: number) => {
                    if (nx < 0 || ny < 0 || nx >= MAP_WIDTH || ny >= MAP_HEIGHT) return true; 
                    return waterSet.has(`${nx},${ny}`);
                };
                
                const autoId = getAutoTileId(
                    isWater(x, y-1),    isWater(x+1, y-1),
                    isWater(x+1, y),    isWater(x+1, y+1),
                    isWater(x, y+1),    isWater(x-1, y+1),
                    isWater(x-1, y),    isWater(x-1, y-1)
                );
                
                groundTiles[y][x] = getPaletteIndex(autoId, 'Still water.png', 'autoset');
            }
        }
    }
}
