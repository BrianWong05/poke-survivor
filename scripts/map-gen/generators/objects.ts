
import { MAP_WIDTH, MAP_HEIGHT, TILE_IDS, TILESET_NAME } from '../constants.js';
import { randomInt } from '../utils/common.js';

export function generateObjects(
  groundTiles: number[][], 
  objectTiles: number[][], 
  grassIndex: number, 
  getPaletteIndex: any,
  paletteIds: any // Pass the resolved palette IDs for trees
) {
  
  // Tree Palette Indices (passed in resolved)
  const {
      treeTopLeft, treeTopRight, treeMidLeft, treeMidRight, treeBotLeft, treeBotRight,
      treeStackL, treeStackR,
      treePine1Top, treePine1Mid, treePine1Bot,
      treePine2Top, treePine2Mid, treePine2Bot, treePine2Joiner,
      treeBigTL, treeBigTM, treeBigTR,
      treeBigML, treeBigMM, treeBigMR,
      treeBigBL, treeBigBM, treeBigBR
  } = paletteIds;


  for (let i = 0; i < 2000; i++) { 
      const x = randomInt(MAP_WIDTH - 1); 
      const y = randomInt(MAP_HEIGHT - 5); 
      
      const rand = Math.random();
      let canPlace = true;

      if (rand < 0.1) {
          // Stacked Tree
          const units = 2 + randomInt(4); // 2 to 5
          const totalHeight = 3 + (units - 1) * 2;
          
          if (x >= MAP_WIDTH - 1) continue;
          if (y >= MAP_HEIGHT - totalHeight) continue; 

          for (let ty = 0; ty < totalHeight; ty++) {
              for (let tx = 0; tx < 2; tx++) {
                   // Check collision with ground (must be grass) and objects (must be empty)
                   if (groundTiles[y+ty][x+tx] !== grassIndex || objectTiles[y+ty][x+tx] !== -1) {
                       canPlace = false;
                       break;
                   }
              }
              if (!canPlace) break;
          }

          if (canPlace) {
              let cy = y;
              
              // Top
              objectTiles[cy][x] = treeTopLeft;     objectTiles[cy][x+1] = treeTopRight; cy++;
              objectTiles[cy][x] = treeMidLeft;     objectTiles[cy][x+1] = treeMidRight; cy++;
              
              // Middle
              for (let k = 0; k < units - 1; k++) {
                  objectTiles[cy][x] = treeStackL;    objectTiles[cy][x+1] = treeStackR; cy++;
                  objectTiles[cy][x] = treeMidLeft;   objectTiles[cy][x+1] = treeMidRight; cy++;
              }
              
              // Bottom
              objectTiles[cy][x] = treeBotLeft;   objectTiles[cy][x+1] = treeBotRight;
          }

      } else if (rand < 0.25) {
          // Big Tree (3x3)
          if (x >= MAP_WIDTH - 2) continue; 
          
          for (let ty = 0; ty < 3; ty++) {
              for (let tx = 0; tx < 3; tx++) {
                   if (groundTiles[y+ty][x+tx] !== grassIndex || objectTiles[y+ty][x+tx] !== -1) {
                       canPlace = false;
                       break;
                   }
              }
              if (!canPlace) break;
          }

          if (canPlace) {
              objectTiles[y][x] = treeBigTL;   objectTiles[y][x+1] = treeBigTM;   objectTiles[y][x+2] = treeBigTR;
              objectTiles[y+1][x] = treeBigML; objectTiles[y+1][x+1] = treeBigMM; objectTiles[y+1][x+2] = treeBigMR;
              objectTiles[y+2][x] = treeBigBL; objectTiles[y+2][x+1] = treeBigBM; objectTiles[y+2][x+2] = treeBigBR;
          }

      } else if (rand < 0.6) {
           // Pine Tree (1x3)
           for (let ty = 0; ty < 3; ty++) {
               if (groundTiles[y+ty][x] !== grassIndex || objectTiles[y+ty][x] !== -1) {
                   canPlace = false;
                   break;
               }
           }

           if (canPlace) {
               // Random variant
               if (Math.random() > 0.5) {
                   objectTiles[y][x] = treePine1Top;
                   objectTiles[y+1][x] = treePine1Mid;
                   objectTiles[y+2][x] = treePine1Bot;
               } else {
                   objectTiles[y][x] = treePine2Top;
                   objectTiles[y+1][x] = treePine2Mid;
                   objectTiles[y+2][x] = treePine2Bot;
               }
           }

      } else {
          // Normal Tree (2x3)
          if (x >= MAP_WIDTH - 1) continue;
          
          for (let ty = 0; ty < 3; ty++) {
              for (let tx = 0; tx < 2; tx++) {
                   if (groundTiles[y+ty][x+tx] !== grassIndex || objectTiles[y+ty][x+tx] !== -1) {
                       canPlace = false;
                       break;
                   }
              }
              if (!canPlace) break;
          }

          if (canPlace) {
              objectTiles[y][x] = treeTopLeft;   objectTiles[y][x+1] = treeTopRight;
              objectTiles[y+1][x] = treeMidLeft; objectTiles[y+1][x+1] = treeMidRight;
              objectTiles[y+2][x] = treeBotLeft; objectTiles[y+2][x+1] = treeBotRight;
          }
      }
  }
}
