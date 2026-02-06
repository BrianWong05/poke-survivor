
// Bitmask constants// Bitmask constants
const N = 1, NE = 2, E = 4, SE = 8, S = 16, SW = 32, W = 64, NW = 128;

/**
 * Explicit definition of 47 AutoTile shapes.
 * Each entry defines the Layout: [N, E, S, W] 
 * and the expected Corners [NE, SE, SW, NW] (1=Present, 0=Missing).
 * 
 * We generate this procedurally to ensure we cover the standard set 
 * (or a logical set that covers all 256 cases via best-fit).
 */
const TILES: { n: number, e: number, s: number, w: number, ne: number, se: number, sw: number, nw: number }[] = [];

// Helper to push tile
function add(n: number, e: number, s: number, w: number, ne=1, se=1, sw=1, nw=1) {
    TILES.push({ n, e, s, w, ne, se, sw, nw });
}

// 0-15: Basic Orthogonal shapes (Corners assumed full)
// This covers Lines, T-Junctions, L-Bends, etc.
for (let i = 0; i < 16; i++) {
    const n = (i&1)?1:0;
    const e = (i&2)?1:0;
    const s = (i&4)?1:0;
    const w = (i&8)?1:0;
    add(n, e, s, w);
}

// 16-31: Full Surround (N+E+S+W) with missing corners
// We iterate the 4 corners (0-15 mask of corners)
for (let i = 0; i < 16; i++) {
    const ne = (i&1)?1:0;
    const se = (i&2)?1:0;
    const sw = (i&4)?1:0;
    const nw = (i&8)?1:0;

    // Otherwise (Loop corners, etc.), respect the missing diagonals
    // so Inner Corners render correctly.
    add(1, 1, 1, 1, ne, se, sw, nw);
}

// 32-35: L-Shapes with missing corner (Inner Corner)
add(1, 1, 0, 0, 0, 1, 1, 1); // N+E (Index 3) but ne=0
add(0, 1, 1, 0, 1, 0, 1, 1); // E+S (Index 6) but se=0
add(0, 0, 1, 1, 1, 1, 0, 1); // S+W (Index 12) but sw=0
add(1, 0, 0, 1, 1, 1, 1, 0); // W+N (Index 9) but nw=0

// 36-47: T-Shapes with missing corners
// T-Shape N+E+S (Index 7). Missing NE, SE, or Both.
add(1, 1, 1, 0, 0, 1, 1, 1); // Missing NE
add(1, 1, 1, 0, 1, 0, 1, 1); // Missing SE
add(1, 1, 1, 0, 0, 0, 1, 1); // Missing Both

// T-Shape E+S+W (Index 14). Missing SE, SW, or Both.
add(0, 1, 1, 1, 1, 0, 1, 1); // Missing SE
add(0, 1, 1, 1, 1, 1, 0, 1); // Missing SW
add(0, 1, 1, 1, 1, 0, 0, 1); // Missing Both

// T-Shape S+W+N (Index 13). Missing SW, NW, or Both.
add(1, 0, 1, 1, 1, 1, 0, 1); // Missing SW
add(1, 0, 1, 1, 1, 1, 1, 0); // Missing NW
add(1, 0, 1, 1, 1, 1, 0, 0); // Missing Both

// T-Shape W+N+E (Index 11). Missing NW, NE, or Both.
add(1, 1, 0, 1, 1, 1, 1, 0); // Missing NW
add(1, 1, 0, 1, 0, 1, 1, 1); // Missing NE
add(1, 1, 0, 1, 0, 1, 1, 0); // Missing Both

export const TILE_LAYOUT_RULES = {
    // Safe lookup
    get: (i: number) => TILES[i] || {n:0,e:0,s:0,w:0,ne:1,se:1,sw:1,nw:1},
    
    hasN: (i: number) => (TILES[i] ? !!TILES[i].n : true),
    hasE: (i: number) => (TILES[i] ? !!TILES[i].e : true),
    hasS: (i: number) => (TILES[i] ? !!TILES[i].s : true),
    hasW: (i: number) => (TILES[i] ? !!TILES[i].w : true),
    
    hasNE: (i: number) => (TILES[i] ? !!TILES[i].ne : true),
    hasSE: (i: number) => (TILES[i] ? !!TILES[i].se : true),
    hasSW: (i: number) => (TILES[i] ? !!TILES[i].sw : true),
    hasNW: (i: number) => (TILES[i] ? !!TILES[i].nw : true),
};


const BITMASK_TO_INDEX: Record<number, number> = {};
let isTableInitialized = false;

function buildTable() {
    if (isTableInitialized) return;
    
    // Iterate 0..255 and find best match in TILES
    for (let mask = 0; mask < 256; mask++) {
        const n  = !!(mask & N);
        const ne = !!(mask & NE);
        const e  = !!(mask & E);
        const se = !!(mask & SE);
        const s  = !!(mask & S);
        const sw = !!(mask & SW);
        const w  = !!(mask & W);
        const nw = !!(mask & NW);
        
        let bestIdx = 0;
        let bestScore = -1;
        
        // Find best fit in the 47 tiles
        for (let i = 0; i < TILES.length; i++) {
            const t = TILES[i];
            let score = 0;
            
            // Critical: Orthogonal match is huge priority
            if (!!t.n !== n) continue; 
            if (!!t.e !== e) continue;
            if (!!t.s !== s) continue;
            if (!!t.w !== w) continue;
            score += 100;
            
            // Diagonals: Only matter if relevant orthogonal neighbors exist
            // e.g. NE matters only if N and E are present
            if (t.n && t.e) {
                if (!!t.ne === ne) score += 10;
            }
            if (t.e && t.s) {
                if (!!t.se === se) score += 10;
            }
            if (t.s && t.w) {
                if (!!t.sw === sw) score += 10;
            }
            if (t.w && t.n) {
                if (!!t.nw === nw) score += 10;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestIdx = i;
            }
        }
        
        BITMASK_TO_INDEX[mask] = bestIdx;
    }

    isTableInitialized = true;
}

/**
 * Calculates the Tile Index based on neighbors.
 */
export function getAutoTileId(n: boolean, ne: boolean, e: boolean, se: boolean, s: boolean, sw: boolean, w: boolean, nw: boolean): number {
    buildTable();

    // 1. Build Mask
    let val = 0;
    if (n) val |= N;
    if (ne) val |= NE;
    if (e) val |= E;
    if (se) val |= SE;
    if (s) val |= S;
    if (sw) val |= SW;
    if (w) val |= W;
    if (nw) val |= NW;
    
    const result = BITMASK_TO_INDEX[val];
    // Debug logging for T-junctions
    // if (n&&e&&s&&w) console.log(`Mask: ${val.toString(2)} -> Index: ${result}`);
    return result;
}
