
import { TILE_IDS, TILESET_NAME, MARKERS } from '../constants.js';
import { TileData } from '../types.js';

export function generateBridges(
  ground: number[][],
  objects: number[][],
  palette: TileData[],
  getPaletteIndex: (id: number, set: string, type: 'tileset' | 'autoset' | 'animations') => number
) {
  const width = ground.length;
  const height = ground[0].length;
  const waterId = MARKERS.WATER;
  
  // Resolve Palette Indices
  const bridgeH = {
    top: getPaletteIndex(TILE_IDS.BRIDGE.H_TOP, TILESET_NAME, 'tileset'),
    mid: getPaletteIndex(TILE_IDS.BRIDGE.H_MID, TILESET_NAME, 'tileset'),
    bot: getPaletteIndex(TILE_IDS.BRIDGE.H_BOT, TILESET_NAME, 'tileset'),
  };

  const bridgeV = {
    left: getPaletteIndex(TILE_IDS.BRIDGE.V_LEFT, TILESET_NAME, 'tileset'),
    mid: getPaletteIndex(TILE_IDS.BRIDGE.V_MID, TILESET_NAME, 'tileset'),
    right: getPaletteIndex(TILE_IDS.BRIDGE.V_RIGHT, TILESET_NAME, 'tileset'),
  };

  const cross = [
    [
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_TL, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_TM, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_TR, TILESET_NAME, 'tileset')
    ],
    [
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_ML, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_MM, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_MR, TILESET_NAME, 'tileset')
    ],
    [
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_BL, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_BM, TILESET_NAME, 'tileset'),
      getPaletteIndex(TILE_IDS.BRIDGE.CROSS_BR, TILESET_NAME, 'tileset')
    ]
  ];
  
  const MIN_SPACING = 20; 
  let lastBridgeY = -MIN_SPACING;

  // 1. Horizontal Scan (Places 3-High Bridges)
  for (let y = 2; y < height - 2; y++) { // Margin for width
    if (y === 2) lastBridgeY = -Math.floor(Math.random() * MIN_SPACING);
    if (y - lastBridgeY < MIN_SPACING) continue;
    if (Math.random() < 0.4) continue;

    for (let x = 1; x < width - 1; x++) {
      if (ground[x][y] !== waterId) continue;
      if (ground[x-1][y] === waterId) continue; // Not start

      let len = 0;
      while (x + len < width && ground[x + len][y] === waterId) {
        len++;
      }

      if (x + len >= width || ground[x + len][y] === waterId) continue;

      if (len >= 2) { 
        // Build Horizontal Bridge (3 Rows)
        for (let i = 0; i < len; i++) {
           const bx = x + i;
           // Place Top
           if (y-1 >= 0) ground[bx][y-1] = bridgeH.top;
           // Place Mid
           ground[bx][y] = bridgeH.mid;
           // Place Bot
           if (y+1 < height) ground[bx][y+1] = bridgeH.bot;
           
           // Clear objects potentially
           objects[bx][y-1] = -1;
           objects[bx][y] = -1;
           objects[bx][y+1] = -1;
        }
        lastBridgeY = y;
        x += len; 
      }
    }
  }

  // 2. Vertical Scan (Places 3-Wide Bridges & Intersections)
  let lastBridgeX = -MIN_SPACING;
  for (let x = 2; x < width - 2; x++) {
     if (x === 2) lastBridgeX = -Math.floor(Math.random() * MIN_SPACING);
     if (x - lastBridgeX < MIN_SPACING) continue;
     if (Math.random() < 0.4) continue;

    for (let y = 1; y < height - 1; y++) {
      // Check for Water OR Existing Horizontal Bridge Tiles
      const isWaterOrBridge = (t: number) => 
        t === waterId || 
        t === bridgeH.mid || 
        t === bridgeH.top || 
        t === bridgeH.bot;
      
      if (!isWaterOrBridge(ground[x][y])) continue;
      if (isWaterOrBridge(ground[x][y-1])) continue; // Not start

      let len = 0;
      while (y + len < height && isWaterOrBridge(ground[x][y + len])) {
        len++;
      }

      if (y + len >= height || isWaterOrBridge(ground[x][y + len])) continue;

      if (len >= 2) { 
        // Build Vertical Bridge
        for (let i = 0; i < len; i++) {
           const by = y + i;
           
           // Check for Intersection (Center is H_MID)
           if (ground[x][by] === bridgeH.mid) {
               // Render 3x3 Intersection
               // Row Y-1 (Top of H-Bridge) -> Map to Left Col of Cross (TL, ML, BL) to match alignment? 
               // Wait, Transpose is [col][row].
               // TL(0,0) -> 0,0.  TM(0,1) -> 1,0 (ML). TR(0,2) -> 2,0 (BL).
               // Let's explicitly map for clarity.
               
               // Target: x-1 (Left Side) needs Top-Row Style (Vertical Planks) -> TM(0,1). 
               // My deduction was: x-1,by needs TM.
               // x-1, by is [0][1] relative to intersection loop? No.
               // ground[x-1][by] is the Left-Center tile.
               // We deduced it needs TM (1241).
               // TM is cross[0][1].
               
               // So we want:
               // ground[x-1][by-1] = cross[0][0]; // TL (Corner) - remains TL?
               // ground[x][by-1]   = cross[1][0]; // TM pos gets ML (Horizontal Plank Style) -> Matches V-Bridge (H-Plank). Perfect.
               
               // Row Y-1 (Top)
               ground[x-1][by-1] = cross[0][0]; // TL -> TL
               ground[x][by-1]   = cross[1][0]; // TM pos -> ML
               ground[x+1][by-1] = cross[2][0]; // TR pos -> BL

               // Row Y (Mid)
               ground[x-1][by]   = cross[0][1]; // ML pos -> TM
               ground[x][by]     = cross[1][1]; // MM -> MM
               ground[x+1][by]   = cross[2][1]; // MR pos -> BM

               // Row Y+1 (Bot)
               ground[x-1][by+1] = cross[0][2]; // BL pos -> TR
               ground[x][by+1]   = cross[1][2]; // BM pos -> MR
               ground[x+1][by+1] = cross[2][2]; // BR pos -> BR
               
               // Skip next iteration (by+1) to prevent overwriting CROSS_BM (now MR/BR zone)
               i++;
           } else {
               // Normal Vertical Segment
               if (x-1 >= 0) ground[x-1][by] = bridgeV.left;
               ground[x][by] = bridgeV.mid;
               if (x+1 < width) ground[x+1][by] = bridgeV.right;
           }
           
            // Clear objects
            objects[x-1][by] = -1;
            objects[x][by] = -1;
            objects[x+1][by] = -1;
        }
        lastBridgeX = x; 
        y += len;
      }
    }
  }
}
