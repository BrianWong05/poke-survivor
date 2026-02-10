
const N = 1, NE = 2, E = 4, SE = 8, S = 16, SW = 32, W = 64, NW = 128;

interface AutoTileDef { n: number, e: number, s: number, w: number, ne: number, se: number, sw: number, nw: number }
const AUTO_TILES: AutoTileDef[] = [];

function addAutoTile(n: number, e: number, s: number, w: number, ne=1, se=1, sw=1, nw=1) {
    AUTO_TILES.push({ n, e, s, w, ne, se, sw, nw });
}

// 0-15: Basic Orthogonal
for (let i = 0; i < 16; i++) {
    addAutoTile((i&1)?1:0, (i&2)?1:0, (i&4)?1:0, (i&8)?1:0);
}
// 16-31: Full Surround
for (let i = 0; i < 16; i++) {
    addAutoTile(1, 1, 1, 1, (i&1)?1:0, (i&2)?1:0, (i&4)?1:0, (i&8)?1:0);
}
// 32-35: L-Shapes (Inner)
addAutoTile(1, 1, 0, 0, 0, 1, 1, 1);
addAutoTile(0, 1, 1, 0, 1, 0, 1, 1);
addAutoTile(0, 0, 1, 1, 1, 1, 0, 1);
addAutoTile(1, 0, 0, 1, 1, 1, 1, 0);
// 36-47: T-Shapes
addAutoTile(1, 1, 1, 0, 0, 1, 1, 1);
addAutoTile(1, 1, 1, 0, 1, 0, 1, 1);
addAutoTile(1, 1, 1, 0, 0, 0, 1, 1);
addAutoTile(0, 1, 1, 1, 1, 0, 1, 1);
addAutoTile(0, 1, 1, 1, 1, 1, 0, 1);
addAutoTile(0, 1, 1, 1, 1, 0, 0, 1);
addAutoTile(1, 0, 1, 1, 1, 1, 0, 1);
addAutoTile(1, 0, 1, 1, 1, 1, 1, 0);
addAutoTile(1, 0, 1, 1, 1, 1, 0, 0);
addAutoTile(1, 1, 0, 1, 1, 1, 1, 0);
addAutoTile(1, 1, 0, 1, 0, 1, 1, 1);
addAutoTile(1, 1, 0, 1, 0, 1, 1, 0);

const BITMASK_TO_INDEX: Record<number, number> = {};
let isTableInitialized = false;

function buildAutoTileTable() {
    if (isTableInitialized) return;
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
        
        for (let i = 0; i < AUTO_TILES.length; i++) {
            const t = AUTO_TILES[i];
            let score = 0;
            if (!!t.n !== n) continue; 
            if (!!t.e !== e) continue;
            if (!!t.s !== s) continue;
            if (!!t.w !== w) continue;
            score += 100;
            if (t.n && t.e && !!t.ne === ne) score += 10;
            if (t.e && t.s && !!t.se === se) score += 10;
            if (t.s && t.w && !!t.sw === sw) score += 10;
            if (t.w && t.n && !!t.nw === nw) score += 10;
            if (score > bestScore) {
                bestScore = score;
                bestIdx = i;
            }
        }
        BITMASK_TO_INDEX[mask] = bestIdx;
    }
    isTableInitialized = true;
}

export function getAutoTileId(n: boolean, ne: boolean, e: boolean, se: boolean, s: boolean, sw: boolean, w: boolean, nw: boolean): number {
    buildAutoTileTable();
    let val = 0;
    if (n) val |= N;
    if (ne) val |= NE;
    if (e) val |= E;
    if (se) val |= SE;
    if (s) val |= S;
    if (sw) val |= SW;
    if (w) val |= W;
    if (nw) val |= NW;
    return BITMASK_TO_INDEX[val];
}
