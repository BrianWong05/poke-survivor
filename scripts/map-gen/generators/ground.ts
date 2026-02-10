
import { MAP_WIDTH, MAP_HEIGHT, MARKERS } from '../constants.js';
import { getAutoTileId } from '../utils/auto-tile.js';
import { generateRandomWalk } from '../utils/algorithms.js';

export function generateDirt(groundTiles: number[][], grassIndex: number, getPaletteIndex: any) {
  const TEMP_DIRT_MARKER = MARKERS.DIRT;
  const TEMP_WATER_MARKER = MARKERS.WATER;
  
  generateRandomWalk(
      groundTiles, 
      MAP_WIDTH, 
      MAP_HEIGHT, 
      TEMP_DIRT_MARKER, 
      15, // count
      200, // minSize
      600, // maxSize (200 + 400)
      [TEMP_WATER_MARKER] // avoidMarkers
  );
}

export function resolveDirtTiles(groundTiles: number[][], getPaletteIndex: any) {
    const TEMP_DIRT_MARKER = MARKERS.DIRT;
    const dirtSet = new Set<string>();
    
    // Build set
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_DIRT_MARKER) {
                dirtSet.add(`${x},${y}`);
            }
        }
    }

    // Resolve AutoTiles
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_DIRT_MARKER) {
                const isDirt = (nx: number, ny: number) => {
                    if (nx < 0 || ny < 0 || nx >= MAP_WIDTH || ny >= MAP_HEIGHT) return true; 
                    return dirtSet.has(`${nx},${ny}`);
                };
                
                const autoId = getAutoTileId(
                    isDirt(x, y-1),    isDirt(x+1, y-1),
                    isDirt(x+1, y),    isDirt(x+1, y+1),
                    isDirt(x, y+1),    isDirt(x-1, y+1),
                    isDirt(x-1, y),    isDirt(x-1, y-1)
                );
                
                groundTiles[y][x] = getPaletteIndex(autoId, 'Dirt.png', 'autoset');
            }
        }
    }
}
