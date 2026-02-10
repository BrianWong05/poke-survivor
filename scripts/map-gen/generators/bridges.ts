
import { TILE_IDS, TILESET_NAME, MARKERS } from '../constants.js';
import { TileData } from '../types.js';

export function generateBridges(
  ground: number[][],
  water: number[][],
  bridges: number[][],
  objects: number[][],
  palette: TileData[],
  getPaletteIndex: (id: number, set: string, type: 'tileset' | 'autoset' | 'animations') => number
) {
  const width = ground.length;
  const height = ground[0].length;
  const waterMarker = MARKERS.WATER;
  
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

  // Helper to place bridge tile
  const placeBridgeTile = (x: number, y: number, bridgeTileId: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    
    // 1. Place Bridge
    bridges[x][y] = bridgeTileId;

    // 2. Clear Objects
    objects[x][y] = -1;
  };

  // 1. Horizontal Scan (Places 3-High Bridges)
  for (let y = 2; y < height - 2; y++) { // Margin for width
    if (y === 2) lastBridgeY = -Math.floor(Math.random() * MIN_SPACING);
    if (y - lastBridgeY < MIN_SPACING) continue;
    if (Math.random() < 0.4) continue;

    for (let x = 1; x < width - 1; x++) {
      // Check water layer for markers
      if (water[x][y] !== waterMarker) continue;
      if (water[x-1][y] === waterMarker) continue; // Not start

      let len = 0;
      while (x + len < width && water[x + len][y] === waterMarker) {
        len++;
      }

      if (x + len >= width || water[x + len][y] === waterMarker) continue;

      if (len >= 2) { 
        // Build Horizontal Bridge (3 Rows)
        for (let i = 0; i < len; i++) {
           const bx = x + i;
           placeBridgeTile(bx, y-1, bridgeH.top);
           placeBridgeTile(bx, y, bridgeH.mid);
           placeBridgeTile(bx, y+1, bridgeH.bot);
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
      const isWater = (wx: number, wy: number) => water[wx][wy] === waterMarker;
      const isBridge = (bx: number, by: number) => 
        bridges[bx][by] === bridgeH.top || 
        bridges[bx][by] === bridgeH.mid || 
        bridges[bx][by] === bridgeH.bot;
      
      const isTarget = (tx: number, ty: number) => isWater(tx, ty) || isBridge(tx, ty);

      if (!isTarget(x, y)) continue;
      if (isTarget(x, y-1)) continue; // Not start

      let len = 0;
      while (y + len < height && isTarget(x, y + len)) {
        len++;
      }

      if (y + len >= height || isTarget(x, y + len)) continue;

      if (len >= 2) { 
        // Build Vertical Bridge
        for (let i = 0; i < len; i++) {
           const by = y + i;
           
           // Check for Intersection (Center is H_MID)
           if (bridges[x][by] === bridgeH.mid) {
               // Render 3x3 Intersection
               
               // Row Y-1 (Top)
               placeBridgeTile(x-1, by-1, cross[0][0]);
               placeBridgeTile(x,   by-1, cross[1][0]); 
               placeBridgeTile(x+1, by-1, cross[2][0]);

               // Row Y (Mid)
               placeBridgeTile(x-1, by, cross[0][1]);
               placeBridgeTile(x,   by, cross[1][1]);
               placeBridgeTile(x+1, by, cross[2][1]);

               // Row Y+1 (Bot)
               placeBridgeTile(x-1, by+1, cross[0][2]);
               placeBridgeTile(x,   by+1, cross[1][2]);
               placeBridgeTile(x+1, by+1, cross[2][2]);
               
               // Skip next iteration (by+1) to prevent overwriting CROSS_BM 
               i++;
           } else {
               // Normal Vertical Segment
               placeBridgeTile(x-1, by, bridgeV.left);
               placeBridgeTile(x,   by, bridgeV.mid);
               placeBridgeTile(x+1, by, bridgeV.right);
           }
        }
        lastBridgeX = x; 
        y += len;
      }
    }
  }
}

export function carveBridges(
    ground: number[][],
    water: number[][],
    bridges: number[][]
) {
    const width = ground.length;
    const height = ground[0].length;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // If there is a bridge tile here
            if (bridges[x][y] !== -1) {
                // And there is water underneath (resolved tile > -1)
                // Note: water layer has resolved tiles now (not markers)
                if (water[x][y] !== -1) {
                    // Move water to ground (patch)
                    ground[x][y] = water[x][y];
                    // Remove from water layer (collision hole)
                    water[x][y] = -1;
                }
            }
        }
    }
}
