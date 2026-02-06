import type { TileData } from '@/game/types/map';
import { getAutoTileId, TILE_LAYOUT_RULES } from '@/game/utils/AutoTileTable';

// Coordinate Constants (16x16 blocks)
const SRC = {
    TL_CORNER: { x: 0, y: 2 }, TR_CORNER: { x: 4, y: 2 },
    BL_CORNER: { x: 0, y: 6 }, BR_CORNER: { x: 4, y: 6 },
    TOP_EDGE:  { x: 2, y: 2 }, BOT_EDGE:  { x: 2, y: 6 },
    LEFT_EDGE: { x: 0, y: 4 }, RIGHT_EDGE:{ x: 4, y: 4 },
    CENTER:    { x: 2, y: 4 },
    INNER_CORNER: { x: 4, y: 0 }
};

export const generateAutoTileTexture = (sourceImg: HTMLImageElement): HTMLCanvasElement | null => {
  // A standard 3x4 tileset (with 32x32 tiles) must be at least 96x128 pixels.
  // (3 tiles wide * 32px = 96px, 4 tiles high * 32px = 128px)
  if (sourceImg.width < 96 || sourceImg.height < 128) {
      console.warn(`[AutoTileGenerator] Image ${sourceImg.src} is too small for 3x4 tileset (${sourceImg.width}x${sourceImg.height}).`);
      return null;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const TILE = 32;

  canvas.width = 8 * TILE;
  canvas.height = 6 * TILE;

  for (let i = 0; i < 47; i++) {
    const dx = (i % 8) * TILE;
    const dy = Math.floor(i / 8) * TILE;
    drawTileByShape(ctx, sourceImg, dx, dy, i);
  }

  return canvas;
};

const drawTileByShape = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  index: number
) => {
    // Use Shared Rules
    const n = TILE_LAYOUT_RULES.hasN(index);
    const s = TILE_LAYOUT_RULES.hasS(index);
    const w = TILE_LAYOUT_RULES.hasW(index);
    const e = TILE_LAYOUT_RULES.hasE(index);
    
    // Check diagonals
    const ne = TILE_LAYOUT_RULES.hasNE(index);
    const se = TILE_LAYOUT_RULES.hasSE(index);
    const sw = TILE_LAYOUT_RULES.hasSW(index);
    const nw = TILE_LAYOUT_RULES.hasNW(index);

    drawQuad(ctx, img, dx, dy, 'TL', n, w, nw);
    drawQuad(ctx, img, dx+16, dy, 'TR', n, e, ne);
    drawQuad(ctx, img, dx, dy+16, 'BL', s, w, sw);
    drawQuad(ctx, img, dx+16, dy+16, 'BR', s, e, se);
};

const drawQuad = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement, 
    dx: number, 
    dy: number, 
    quad: string,
    vert: boolean,
    horiz: boolean,
    diag: boolean
) => {
    const MINI = 16;
    let src = SRC.CENTER;

    // Logic: "If I have a Vertical Neighbor but No Horizontal, I am a Vertical Edge"
    if (!vert && !horiz) {
        // Outer Corner
        if (quad === 'TL') src = SRC.TL_CORNER;
        if (quad === 'TR') src = SRC.TR_CORNER;
        if (quad === 'BL') src = SRC.BL_CORNER;
        if (quad === 'BR') src = SRC.BR_CORNER;
    } else if (!vert && horiz) {
        // Horizontal Edge (Top/Bot)
        if (quad === 'TL' || quad === 'TR') src = SRC.TOP_EDGE;
        if (quad === 'BL' || quad === 'BR') src = SRC.BOT_EDGE;
    } else if (vert && !horiz) {
        // Vertical Edge (Left/Right)
        if (quad === 'TL' || quad === 'BL') src = SRC.LEFT_EDGE;
        if (quad === 'TR' || quad === 'BR') src = SRC.RIGHT_EDGE;
    } else {
        // Connected Orthogonally
        if (!diag) {
             // Inner Corner! (Missing diagonal neighbor)
             src = SRC.INNER_CORNER;
        } else {
             // Full Center
             src = SRC.CENTER;
        }
    }

    // Offset Source for TR/BL/BR to grab correct half of the texture
    let sx = src.x;
    let sy = src.y;
    if (quad === 'TR' || quad === 'BR') sx += 1; // Shift Right
    if (quad === 'BL' || quad === 'BR') sy += 1; // Shift Down

    // Source coords (in 16px units) -> pixels
    ctx.drawImage(img, sx * MINI, sy * MINI, MINI, MINI, dx, dy, MINI, MINI);
};


// --- GRID UPDATES ---

/**
 * Recursively updates tiles around (x, y) if they belong to the same AutoTile set.
 */
export const updateAutoTileGrid = (
  previousGrid: TileData[][],
  x: number,
  y: number,
  tileSet: string
): TileData[][] => {
  // Deep copy the grid so we can mutate it freely
  const grid = previousGrid.map(row => row.map(cell => ({ ...cell })));
  const mapHeight = grid.length;
  const mapWidth = grid[0].length;
  const visited = new Set<string>();

  const updateNode = (cx: number, cy: number) => {
    if (cx < 0 || cy < 0 || cx >= mapWidth || cy >= mapHeight) return;
    
    // Safety check for recursion loop
    const key = `${cx},${cy}`;
    if (visited.has(key)) return;
    visited.add(key);

    const tile = grid[cy][cx];
    
    // Only update tiles that match the target set and are auto-tiles
    // (We also check type === 'autoset', just to be safe)
    if (tile.id === -1 || tile.set !== tileSet || tile.type !== 'autoset') return;

    // Neighbor check function
    const hasSameNeighbor = (nx: number, ny: number) => {
        if (nx < 0 || ny < 0 || nx >= mapWidth || ny >= mapHeight) return false; // Edge is NOT a connection? Or should it be? 
        // Standard RPGMaker: Edges often connect. treating out-of-bounds as 'connected' makes borders clean.
        // Let's assume out-of-bounds IS connected if we want walls to touch edge of map.
        // BUT, here we check `!!tile` in Phaser. Let's check matching set.
        
        const nTile = grid[ny][nx];
        return nTile.id !== -1 && nTile.set === tileSet;
    };

    const autoId = getAutoTileId(
        hasSameNeighbor(cx, cy - 1), // N
        hasSameNeighbor(cx + 1, cy - 1), // NE
        hasSameNeighbor(cx + 1, cy), // E
        hasSameNeighbor(cx + 1, cy + 1), // SE
        hasSameNeighbor(cx, cy + 1), // S
        hasSameNeighbor(cx - 1, cy + 1), // SW
        hasSameNeighbor(cx - 1, cy), // W
        hasSameNeighbor(cx - 1, cy - 1)  // NW
    );

    grid[cy][cx].id = autoId;
  };

  // 1. Update the placed tile
  updateNode(x, y);

  // 2. Update all 8 neighbors
  // We manually call updateNode on neighbors to ensure they refresh their shape
  // (We clear 'visited' because we WANT to re-visit neighbors even if we just visited them in step 1, 
  // actually step 1 sets the ID, step 2 updates neighbors based on new adjacency)
  
  // Wait, recursion: if I place a tile, my neighbors change shape. Their neighbors might NOT change shape
  // unless the neighbor itself changed "connectedness". 
  // Simply updating the 8 neighbors is usually sufficient for Blob tiles.
  // The 'visited' set prevented re-calc of the center.
  // Let's just manually update 3x3 area.
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue; // Already done
        visited.clear(); // Clear visited so we can recalc neighbors
        updateNode(x + dx, y + dy);
    }
  }

  return grid;
};
