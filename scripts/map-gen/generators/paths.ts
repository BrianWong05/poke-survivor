
import { MAP_WIDTH, MAP_HEIGHT, MARKERS } from '../constants.js';
import { createEmptyLayer } from '../utils/common.js';
import { getAutoTileId } from '../utils/auto-tile.js';
import { Point } from '../types.js';
import { findPath, buildBSP, BSPLeaf } from '../utils/algorithms.js';

const MIN_LEAF_SIZE = 50; 
const MAX_LEAF_SIZE = 80;

export function generatePaths(groundTiles: number[][], palette: any[], getPaletteIndex: any) {
  const TEMP_PATH_MARKER = MARKERS.PATH;
  const TEMP_WATER_MARKER = MARKERS.WATER;

  // Initialize Terrain Cost Map
  const terrainCosts = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, 0);
  for(let y=0; y<MAP_HEIGHT; y++) {
    for(let x=0; x<MAP_WIDTH; x++) {
        terrainCosts[y][x] = 1.0 + Math.random() * 2.0; 
    }
  }

  function drawThickPath(pathPoints: Point[]) {
      const thickness = 2; 
      for (const p of pathPoints) {
          for (let dy = -thickness; dy <= thickness; dy++) {
              for (let dx = -thickness; dx <= thickness; dx++) {
                  if (Math.abs(dx) + Math.abs(dy) <= 3) {
                      const px = p.x + dx;
                      const py = p.y + dy;
                      if (px >= 0 && px < MAP_WIDTH && py >= 0 && py < MAP_HEIGHT) {
                          if (groundTiles[py][px] !== TEMP_WATER_MARKER) {
                            groundTiles[py][px] = TEMP_PATH_MARKER;
                          }
                      }
                  }
              }
          }
      }
  }

  function createPath(l: BSPLeaf) {
      if (l.leftChild && l.rightChild) {
          const p1 = l.leftChild.center;
          const p2 = l.rightChild.center;
          
          const pathPoints = findPath(
            p1, 
            p2, 
            MAP_WIDTH, 
            MAP_HEIGHT,
            (x, y) => groundTiles[y][x] === TEMP_WATER_MARKER, // isBlocked
            (x, y) => terrainCosts[y][x] // getCost
          );

          if (pathPoints) {
              drawThickPath(pathPoints);
          }

          createPath(l.leftChild);
          createPath(l.rightChild);
      }
  }

  const bspRoot = buildBSP(MAP_WIDTH, MAP_HEIGHT, MIN_LEAF_SIZE, MAX_LEAF_SIZE);
  createPath(bspRoot);
}

export function resolvePathTiles(groundTiles: number[][], getPaletteIndex: any) {
    const TEMP_PATH_MARKER = MARKERS.PATH;
    const pathSet = new Set<string>();
    
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_PATH_MARKER) {
                pathSet.add(`${x},${y}`);
            }
        }
    }

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (groundTiles[y][x] === TEMP_PATH_MARKER) {
                const isPath = (nx: number, ny: number) => {
                    if (nx < 0 || ny < 0 || nx >= MAP_WIDTH || ny >= MAP_HEIGHT) return true; 
                    return pathSet.has(`${nx},${ny}`);
                };
                
                const autoId = getAutoTileId(
                    isPath(x, y-1),    isPath(x+1, y-1),
                    isPath(x+1, y),    isPath(x+1, y+1),
                    isPath(x, y+1),    isPath(x-1, y+1),
                    isPath(x-1, y),    isPath(x-1, y-1)
                );
                
                groundTiles[y][x] = getPaletteIndex(autoId, 'Brick path.png', 'autoset');
            }
        }
    }
}
