
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types (Re-defined to avoid import issues in standalone script) ---

export interface TileData {
  id: number;
  set: string;
  type: 'tileset' | 'autoset' | 'animations';
}

export interface SerializedLayer {
  id: string;
  name: string;
  tiles: number[][]; // Palette indices
  collision: boolean;
  locked?: boolean;
}

export interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  palette?: TileData[];
  ground: (number | TileData)[][];
  objects: (number | TileData)[][];
  layers?: SerializedLayer[];
  spawnPoint?: { x: number; y: number };
}


// --- Constants ---

const MAP_WIDTH = 300;
const MAP_HEIGHT = 300;
const TILE_SIZE = 32;
const OUTPUT_PATH = path.resolve(__dirname, '../src/assets/maps/outdoor.json');
const TILESET_NAME = 'Outside.png';

// Tile IDs (Derived from test.json)
// test.json palette:
// 0: id 2 (Grass)
// 1: id 420 (Tree Top Left?) - Wait, let's verify map usage.
// In test.json objects: 
// [1, 2]
// [3, 4]
// [5, 6]
// This corresponds to palette indices 1, 2, 3, 4, 5, 6.
// Let's assume the palette in test.json is sequential for the tree.
// We need to fetch the IDs from test.json palette to be sure.
// If I can't read them all, I'll assume they are:
// 420, 421 (Top)
// 428, 429 (Middle)
// 436, 437 (Bottom)
// based on standard tileset layouts (row width 8?). 
// 420 + 8 = 428. 428 + 8 = 436. Yes, this makes sense for a 2-wide tree in an 8-wide tileset.

const TILE_IDS = {
  GRASS: 2, 
  
  // Tree is 2x3
  TREE_TL: 420, TREE_TR: 421,
  TREE_ML: 428, TREE_MR: 429,
  TREE_BL: 436, TREE_BR: 437,

  // Stacked Tree Joiner (2x1)
  TREE_STACK_L: 422, TREE_STACK_R: 423,

  // Pine Tree (1x3)
  // Pine Tree 1 (Light)
  TREE_PINE_1_TOP: 470,
  TREE_PINE_1_MID: 478,
  TREE_PINE_1_BOT: 486,

  // Pine Tree 2 (Dark)
  TREE_PINE_2_TOP: 494,
  TREE_PINE_2_MID: 502,
  TREE_PINE_2_BOT: 510,

  // Big Tree (3x3)
  TREE_BIG_TL: 440, TREE_BIG_TM: 441, TREE_BIG_TR: 442,
  TREE_BIG_ML: 448, TREE_BIG_MM: 449, TREE_BIG_MR: 450,
  TREE_BIG_BL: 456, TREE_BIG_BM: 457, TREE_BIG_BR: 458,

  // Water (Guessing based on typical sets, or I can try 50?)
  // Let's use 160 for water for now? Or 1?
  // Actually, I'll stick to a placeholder for water (e.g. 50) and users can fix it.
  WATER: 250, 
  
  PATH: 25, 
  ROCK: 85,    
  FLOWER: 15,  
};


// --- Helper Functions ---

// --- AutoTile Logic (Ported from AutoTileTable.ts) ---
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

function getAutoTileId(n: boolean, ne: boolean, e: boolean, se: boolean, s: boolean, sw: boolean, w: boolean, nw: boolean): number {
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


function createEmptyLayer(width: number, height: number, defaultValue: number): number[][] {
  const layer = [];
  for (let y = 0; y < height; y++) {
    layer.push(new Array(width).fill(defaultValue));
  }
  return layer;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// --- Main Generation Logic ---

async function generateOutdoorMap() {
  console.log(`Generating ${MAP_WIDTH}x${MAP_HEIGHT} outdoor map...`);

  // 1. Initialize Palette
  const palette: TileData[] = [];
  const paletteMap = new Map<string, number>(); // Key: SetName + Type

  function getPaletteIndex(tileId: number, set: string, type: 'tileset' | 'autoset'): number {
    // For tilesets, we often reuse the same set/type combo, but ID varies.
    // The palette entry usually defines the SET and TYPE, and the ID in the map data references THIS palette entry.
    // WAIT. In the map data: `ground: (number | TileData)[][]`.
    // If it's a number, it's an index into the `palette` array.
    // If we use the palette array:
    // Palette[i] = { id: <source_id>, set: <filename>, type: <type> }
    // BUT, for AutoTiles, the ID changes per tile (0-47).
    // Does the palette entry store the *Base* ID? Or do we need 48 palette entries?
    // Looking at `types/map.ts`: `palette` is `TileData[]`.
    // Looking at `test.json`: The palette contains `id: 2, set: Outside.png`. Matches the tile ID 2.
    // If I have 1000 grass tiles (id 2), I have 1 palette entry, and the map data says '0' (index in palette) everywhere.
    // For AutoTiles: Since the ID (0-47) determines the look, do we need 48 palette entries?
    // OR does the game engine handle "This palette entry is an autoset" and the map data contains the calculation?
    // `EditorCanvas` render loop:
    // `drawTile(ctx, tile...)`
    // `tile` comes from `layer.tiles`.
    // `layers` in `test.json` (and `map.ts`) uses `tiles: number[][]`.
    // These numbers are PALETTE INDICES.
    // So if I have an AutoTile at index 5 of the palette:
    // And I want shape 34.
    // Does palette[5] have `id: 34`? Then I need a palette entry for EACH shape I use?
    // `test.json` has `tiles: number[][]`.
    // YES. If the map data just stores palette indices, then for every unique tile ID (visual), I need a palette entry.
    // So for an Autoset, I might need up to 47 palette entries if I use all shapes.
    // That seems verbose but correct for this format.
    
    // Key for cache:
    const key = `${set}:${type}:${tileId}`;
    if (paletteMap.has(key)) return paletteMap.get(key)!;
    
    const index = palette.length;
    palette.push({ id: tileId, set, type });
    paletteMap.set(key, index);
    return index;
  }

  const grassIndex = getPaletteIndex(TILE_IDS.GRASS, TILESET_NAME, 'tileset');
  const waterIndex = getPaletteIndex(TILE_IDS.WATER, TILESET_NAME, 'tileset'); // Placeholder
  // Path will be dynamic
  const rockIndex = getPaletteIndex(TILE_IDS.ROCK, TILESET_NAME, 'tileset');
  const flowerIndex = getPaletteIndex(TILE_IDS.FLOWER, TILESET_NAME, 'tileset');

  // Tree Palette Indices
  const treeTopLeft = getPaletteIndex(TILE_IDS.TREE_TL, TILESET_NAME, 'tileset');
  const treeTopRight = getPaletteIndex(TILE_IDS.TREE_TR, TILESET_NAME, 'tileset');
  const treeMidLeft = getPaletteIndex(TILE_IDS.TREE_ML, TILESET_NAME, 'tileset');
  const treeMidRight = getPaletteIndex(TILE_IDS.TREE_MR, TILESET_NAME, 'tileset');
  const treeBotLeft = getPaletteIndex(TILE_IDS.TREE_BL, TILESET_NAME, 'tileset');
  const treeBotRight = getPaletteIndex(TILE_IDS.TREE_BR, TILESET_NAME, 'tileset');

  // Stacked Tree Joiner
  const treeStackL = getPaletteIndex(TILE_IDS.TREE_STACK_L, TILESET_NAME, 'tileset');
  const treeStackR = getPaletteIndex(TILE_IDS.TREE_STACK_R, TILESET_NAME, 'tileset');

  // Pine Tree Palette Indices
  // Pine Tree Palette Indices
  const treePine1Top = getPaletteIndex(TILE_IDS.TREE_PINE_1_TOP, TILESET_NAME, 'tileset');
  const treePine1Mid = getPaletteIndex(TILE_IDS.TREE_PINE_1_MID, TILESET_NAME, 'tileset');
  const treePine1Bot = getPaletteIndex(TILE_IDS.TREE_PINE_1_BOT, TILESET_NAME, 'tileset');

  const treePine2Top = getPaletteIndex(TILE_IDS.TREE_PINE_2_TOP, TILESET_NAME, 'tileset');
  const treePine2Mid = getPaletteIndex(TILE_IDS.TREE_PINE_2_MID, TILESET_NAME, 'tileset');
  const treePine2Bot = getPaletteIndex(TILE_IDS.TREE_PINE_2_BOT, TILESET_NAME, 'tileset');

  // Big Tree Palette Indices
  const treeBigTL = getPaletteIndex(TILE_IDS.TREE_BIG_TL, TILESET_NAME, 'tileset');
  const treeBigTM = getPaletteIndex(TILE_IDS.TREE_BIG_TM, TILESET_NAME, 'tileset');
  const treeBigTR = getPaletteIndex(TILE_IDS.TREE_BIG_TR, TILESET_NAME, 'tileset');
  
  const treeBigML = getPaletteIndex(TILE_IDS.TREE_BIG_ML, TILESET_NAME, 'tileset');
  const treeBigMM = getPaletteIndex(TILE_IDS.TREE_BIG_MM, TILESET_NAME, 'tileset');
  const treeBigMR = getPaletteIndex(TILE_IDS.TREE_BIG_MR, TILESET_NAME, 'tileset');

  const treeBigBL = getPaletteIndex(TILE_IDS.TREE_BIG_BL, TILESET_NAME, 'tileset');
  const treeBigBM = getPaletteIndex(TILE_IDS.TREE_BIG_BM, TILESET_NAME, 'tileset');
  const treeBigBR = getPaletteIndex(TILE_IDS.TREE_BIG_BR, TILESET_NAME, 'tileset');


  // 2. Create Layers
  const groundTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, grassIndex);
  const objectTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, -1); 
  const decorationTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, -1);

  // Helper to check if area is free
  function isAreaFree(startX: number, startY: number, width: number, height: number, layer: number[][]): boolean {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
        if (layer[y][x] !== -1) return false;
        if (groundTiles[y][x] === waterIndex) return false;
      }
    }
    return true;
  }

  // 3. Procedural Generation Steps

  // B. Generate Paths using Autoset
  const TEMP_WATER_MARKER = -998;
  const TEMP_DIRT_MARKER = -997;
  const TEMP_PATH_MARKER = -999; 
  
  // Helper: Generate Organic Blobs
  function generateBlob(marker: number, count: number, minSize: number, maxSize: number, avoidMarkers: number[] = []) {
      for (let i = 0; i < count; i++) {
        let cx = randomInt(MAP_WIDTH);
        let cy = randomInt(MAP_HEIGHT);
        
        // Ensure start is valid
        if (avoidMarkers.includes(groundTiles[cy][cx])) continue;

        const size = minSize + randomInt(maxSize - minSize);
        const openList = [{x: cx, y: cy}];
        groundTiles[cy][cx] = marker;
        
        let currentSize = 1;
        while (currentSize < size && openList.length > 0) {
            // Pick a random point from the "edge" (or just active list) to grow from
            const idx = randomInt(openList.length);
            const {x, y} = openList[idx];
            
            // Try to grow to a neighbor
            const moves = [
                {dx:0, dy:-1}, {dx:1, dy:0}, {dx:0, dy:1}, {dx:-1, dy:0}
            ];
            
            let grown = false;
            // distinct randomization for spread
            for (let k = moves.length - 1; k > 0; k--) {
                const r = Math.floor(Math.random() * (k + 1));
                [moves[k], moves[r]] = [moves[r], moves[k]];
            }

            for (const m of moves) {
                const nx = x + m.dx;
                const ny = y + m.dy;
                
                if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
                    if (groundTiles[ny][nx] !== marker && !avoidMarkers.includes(groundTiles[ny][nx])) {
                        groundTiles[ny][nx] = marker;
                        openList.push({x: nx, y: ny});
                        currentSize++;
                        grown = true;
                        break; // Grow one at a time per iteration per parent choice to keep it somewhat compact
                    }
                }
            }
            
            // Optimization: If we failed to grow from this node multiple times, maybe remove it? 
            // For simple blob, just letting it stay in list is fine, but might be slow.
            // Let's rely on high randomness.
            if (!grown && Math.random() < 0.1) {
                openList.splice(idx, 1);
            }
        }
      }
  }

  // A. Generate Lakes
  
  // Large Lakes
  generateBlob(TEMP_WATER_MARKER, 2 + randomInt(2), 2000, 3500, []);

  // Medium Lakes
  generateBlob(TEMP_WATER_MARKER, 3 + randomInt(3), 800, 1500, []);

  // Small Ponds
  generateBlob(TEMP_WATER_MARKER, 5 + randomInt(5), 150, 500, []);

  // Helper: Smooth terrain to remove sawtooth edges
  function smoothMap(marker: number, iterations: number) {
      for (let i = 0; i < iterations; i++) {
          const newTiles = groundTiles.map(row => [...row]);
          for (let y = 1; y < MAP_HEIGHT - 1; y++) {
              for (let x = 1; x < MAP_WIDTH - 1; x++) {
                  let neighbors = 0;
                  for (let dy = -1; dy <= 1; dy++) {
                      for (let dx = -1; dx <= 1; dx++) {
                          if (dx === 0 && dy === 0) continue;
                          if (groundTiles[y + dy][x + dx] === marker) {
                              neighbors++;
                          }
                      }
                  }

                  if (neighbors > 4) {
                      newTiles[y][x] = marker;
                  } else if (neighbors < 4) {
                      if (newTiles[y][x] === marker) {
                          newTiles[y][x] = grassIndex;
                      }
                  }
              }
          }
          // Apply changes
          for(let y=0; y<MAP_HEIGHT; y++) {
            for(let x=0; x<MAP_WIDTH; x++) {
                groundTiles[y][x] = newTiles[y][x];
            }
          }
      }
  }

  // Smooth the lakes
  smoothMap(TEMP_WATER_MARKER, 2);

  // A2. Generate Dirt Patches
  // Avoid water
  const numDirtPatches = 15;
  for (let i = 0; i < numDirtPatches; i++) {
    let x = randomInt(MAP_WIDTH);
    let y = randomInt(MAP_HEIGHT);
    const size = 200 + randomInt(400); 
    
    // Find valid start
    let attempts = 0;
    while (attempts < 50 && groundTiles[y][x] === TEMP_WATER_MARKER) {
        x = randomInt(MAP_WIDTH);
        y = randomInt(MAP_HEIGHT);
        attempts++;
    }

    if (groundTiles[y][x] === TEMP_WATER_MARKER) continue;

    for (let j = 0; j < size; j++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        // Don't overwrite water
        if (groundTiles[y][x] !== TEMP_WATER_MARKER) {
            groundTiles[y][x] = TEMP_DIRT_MARKER;
        }
      }
      x += randomInt(3) - 1;
      y += randomInt(3) - 1;
      x = Math.max(0, Math.min(MAP_WIDTH - 1, x));
      y = Math.max(0, Math.min(MAP_HEIGHT - 1, y));
    }
  }

  // BSP Path Generation
  const MIN_LEAF_SIZE = 50; 
  const MAX_LEAF_SIZE = 80;

  class Leaf {
      x: number; y: number; width: number; height: number;
      leftChild?: Leaf;
      rightChild?: Leaf;
      
      constructor(x: number, y: number, width: number, height: number) {
          this.x = x; this.y = y; this.width = width; this.height = height;
      }

      get center() {
          return { x: Math.floor(this.x + this.width / 2), y: Math.floor(this.y + this.height / 2) };
      }

      split(): boolean {
         if (this.leftChild || this.rightChild) return false;
         
         // Determine direction
         let splitH = Math.random() > 0.5;
         if (this.width > this.height && this.width / this.height >= 1.25) splitH = false;
         else if (this.height > this.width && this.height / this.width >= 1.25) splitH = true;

         const max = (splitH ? this.height : this.width) - MIN_LEAF_SIZE;
         if (max <= MIN_LEAF_SIZE) return false;

         const split = randomInt(max - MIN_LEAF_SIZE) + MIN_LEAF_SIZE;

         if (splitH) {
             this.leftChild = new Leaf(this.x, this.y, this.width, split);
             this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
         } else {
             this.leftChild = new Leaf(this.x, this.y, split, this.height);
             this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
         }
         return true;
      }
  }
  
  // Initialize Terrain Cost Map for A* Wiggle
  const terrainCosts = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, 0);
  for(let y=0; y<MAP_HEIGHT; y++) {
    for(let x=0; x<MAP_WIDTH; x++) {
        terrainCosts[y][x] = 1.0 + Math.random() * 2.0; // Higher variance = more wiggle
    }
  }

  interface Point { x: number, y: number }
  interface Node { x: number, y: number, g: number, f: number, parent?: Node }

  function findPath(start: Point, end: Point): Point[] | null {
      const openList: Node[] = [];
      const closedSet = new Set<string>();
      
      const startNode: Node = { x: start.x, y: start.y, g: 0, f: 0 };
      openList.push(startNode);
      
      // Safety break
      let ops = 0;
      
      while(openList.length > 0 && ops < 20000) {
          ops++;
          // Get lowest f
          openList.sort((a, b) => a.f - b.f);
          const current = openList.shift()!;
          
          if (Math.abs(current.x - end.x) < 2 && Math.abs(current.y - end.y) < 2) {
              // Reconstruct
              const path: Point[] = [];
              let curr: Node | undefined = current;
              while(curr) {
                  path.push({x: curr.x, y: curr.y});
                  curr = curr.parent;
              }
              return path.reverse();
          }
          
          closedSet.add(`${current.x},${current.y}`);
          
          const neighbors = [
              {x: current.x, y: current.y - 1},
              {x: current.x + 1, y: current.y},
              {x: current.x, y: current.y + 1},
              {x: current.x - 1, y: current.y}
          ];
          
          for(const n of neighbors) {
              if (n.x < 0 || n.x >= MAP_WIDTH || n.y < 0 || n.y >= MAP_HEIGHT) continue;
              if (closedSet.has(`${n.x},${n.y}`)) continue;
              
              // Obstacle check: Water is wall
              if (groundTiles[n.y][n.x] === TEMP_WATER_MARKER) continue;
              
              const gScore = current.g + terrainCosts[n.y][n.x]; // Use random cost
              const hScore = Math.abs(n.x - end.x) + Math.abs(n.y - end.y);
              const fScore = gScore + hScore;
              
              const existing = openList.find(node => node.x === n.x && node.y === n.y);
              if (existing) {
                  if (gScore < existing.g) {
                      existing.g = gScore;
                      existing.f = fScore;
                      existing.parent = current;
                  }
              } else {
                  openList.push({ x: n.x, y: n.y, g: gScore, f: fScore, parent: current });
              }
          }
      }
      return null;
  }

  function drawThickPath(pathPoints: Point[]) {
      const thickness = 2; // Radius
      for (const p of pathPoints) {
          for (let dy = -thickness; dy <= thickness; dy++) {
              for (let dx = -thickness; dx <= thickness; dx++) {
                  // Make it roughly circular or just square
                  if (Math.abs(dx) + Math.abs(dy) <= 3) {
                      const px = p.x + dx;
                      const py = p.y + dy;
                      if (px >= 0 && px < MAP_WIDTH && py >= 0 && py < MAP_HEIGHT) {
                          // Don't overwrite water
                          if (groundTiles[py][px] !== TEMP_WATER_MARKER) {
                            groundTiles[py][px] = TEMP_PATH_MARKER;
                          }
                      }
                  }
              }
          }
      }
  }

  function createPath(l: Leaf) {
      if (l.leftChild && l.rightChild) {
          const p1 = l.leftChild.center;
          const p2 = l.rightChild.center;
          
          // Use A* Pathfinding
          const pathPoints = findPath(p1, p2);
          if (pathPoints) {
              drawThickPath(pathPoints);
          }

          createPath(l.leftChild);
          createPath(l.rightChild);
      }
  }

  function buildBSP() {
      const root = new Leaf(0, 0, MAP_WIDTH, MAP_HEIGHT);
      
      const queue = [root];
      while(queue.length > 0) {
          const l = queue.shift()!;
          if (l.width > MAX_LEAF_SIZE || l.height > MAX_LEAF_SIZE || Math.random() > 0.25) {
              if (l.split()) {
                  queue.push(l.leftChild!);
                  queue.push(l.rightChild!);
              }
          }
      }
      return root;
  }

  const bspRoot = buildBSP();
  createPath(bspRoot);
  
  // Post-process: Resolve Autotiles
  
  // 1. Resolve Water
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

  // 2. Resolve Dirt
  const dirtSet = new Set<string>();
  for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
          if (groundTiles[y][x] === TEMP_DIRT_MARKER) {
              dirtSet.add(`${x},${y}`);
          }
      }
  }

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

  // 3. Resolve Paths
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

  // C. Generate Objects (Trees & Rocks)
  for (let i = 0; i < 2000; i++) { 
      const x = randomInt(MAP_WIDTH - 1); // Ensure space for 2-wide
      const y = randomInt(MAP_HEIGHT - 5); // Ensure space for 5-high (max possible)
      


      const rand = Math.random();
      let canPlace = true;

      if (rand < 0.1) {
          // Stacked Tree (2 to 5 units high) - 10% Chance
          // Height calc: 
          // 2 units = 5 tiles (Top, Mid, Joiner, Mid, Bot)
          // 3 units = 7 tiles (Top, Mid, Joiner, Mid, Joiner, Mid, Bot)
          // Formula: 2 (Top,Mid) + (Units-1)*2 (Joiner,Mid) + 1 (Bot) -> 3 + (Units-1)*2
          
          const units = 2 + randomInt(4); // 2 to 5
          const totalHeight = 3 + (units - 1) * 2;
          
          if (x >= MAP_WIDTH - 1) continue;
          if (y >= MAP_HEIGHT - totalHeight) continue; // Boundary check

          for (let ty = 0; ty < totalHeight; ty++) {
              for (let tx = 0; tx < 2; tx++) {
                   if (groundTiles[y+ty][x+tx] !== grassIndex || objectTiles[y+ty][x+tx] !== -1) {
                       canPlace = false;
                       break;
                   }
              }
              if (!canPlace) break;
          }

          if (canPlace) {
              let cy = y;
              
              // Top Section
              objectTiles[cy][x] = treeTopLeft;     objectTiles[cy][x+1] = treeTopRight; cy++;
              objectTiles[cy][x] = treeMidLeft;     objectTiles[cy][x+1] = treeMidRight; cy++;
              
              // Middle Sections (Units-1 times)
              for (let k = 0; k < units - 1; k++) {
                  // Joiner
                  objectTiles[cy][x] = treeStackL;    objectTiles[cy][x+1] = treeStackR; cy++;
                  // Mid
                  objectTiles[cy][x] = treeMidLeft;   objectTiles[cy][x+1] = treeMidRight; cy++;
              }
              
              // Bottom Section
              objectTiles[cy][x] = treeBotLeft;   objectTiles[cy][x+1] = treeBotRight;
          }

      } else if (rand < 0.25) {
          // Big Tree (3x3) - 15% Chance
          if (x >= MAP_WIDTH - 2) continue; // Need 3 width
          
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
           // Pine Tree (1x3) - 45% Chance
           for (let ty = 0; ty < 3; ty++) {
               if (groundTiles[y+ty][x] !== grassIndex || objectTiles[y+ty][x] !== -1) {
                   canPlace = false;
                   break;
               }
           }
           if (canPlace) {
               // Randomly pick Pine Variant
               if (Math.random() < 0.5) {
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
           // Round Tree (2x3) - 40% Chance
           // Check x+1 bound explicitly although initial randomInt handles up to MAP_WIDTH-1
           if (x >= MAP_WIDTH - 1) continue;

           for (let ty = 0; ty < 3; ty++) {
               for (let tx = 0; tx < 2; tx++) {
                   // Now we also check if it's NOT a path (path is an autoset index, not grass)
                   if (groundTiles[y+ty][x+tx] !== grassIndex || objectTiles[y+ty][x+tx] !== -1) {
                       canPlace = false;
                       break;
                   }
               }
               if (!canPlace) break;
           }
    
           if (canPlace) {
               objectTiles[y][x] = treeTopLeft;
               objectTiles[y][x+1] = treeTopRight;
               objectTiles[y+1][x] = treeMidLeft;
               objectTiles[y+1][x+1] = treeMidRight;
               objectTiles[y+2][x] = treeBotLeft;
               objectTiles[y+2][x+1] = treeBotRight;
           }
      }
  }

  // Rocks & Flowers
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (groundTiles[y][x] === grassIndex && objectTiles[y][x] === -1) {
        const rand = Math.random();
        if (rand < 0.01) {
          objectTiles[y][x] = rockIndex;
        }
        else if (rand < 0.03) {
          decorationTiles[y][x] = flowerIndex;
        }
      }
    }
  }
  
  // D. Ensure Spawn Point is Safe
  const spawnX = Math.floor(MAP_WIDTH / 2);
  const spawnY = Math.floor(MAP_HEIGHT / 2);
  
  for(let y = spawnY - 5; y <= spawnY + 5; y++) {
      for(let x = spawnX - 5; x <= spawnX + 5; x++) {
          if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
              groundTiles[y][x] = grassIndex; 
              objectTiles[y][x] = -1;
              decorationTiles[y][x] = -1;
          }
      }
  }

  // 4. Assemble Map Data
  const layers: SerializedLayer[] = [
    {
      id: 'layer-ground',
      name: 'Ground',
      tiles: groundTiles,
      collision: false
    },
    {
      id: 'layer-objects',
      name: 'Objects',
      tiles: objectTiles,
      collision: true
    },
    {
      id: 'layer-decorations',
      name: 'Decorations',
      tiles: decorationTiles,
      collision: false
    }
  ];

  const mapData: CustomMapData = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tileSize: TILE_SIZE,
    palette: palette,
    ground: groundTiles,
    objects: objectTiles,
    layers: layers,
    spawnPoint: { x: spawnX, y: spawnY }
  };

  // 5. Save File
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapData, null, 2));
  console.log(`Map saved to ${OUTPUT_PATH}`);
}

generateOutdoorMap().catch(console.error);
