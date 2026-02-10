
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILESET_NAME, TILE_IDS } from './map-gen/constants.js';
import { TileData } from './map-gen/types.js';
import { createEmptyLayer } from './map-gen/utils/common.js';

import { generateLakes, smoothWater, resolveWaterTiles } from './map-gen/generators/water.js';
import { generateDirt, resolveDirtTiles } from './map-gen/generators/ground.js';
import { generatePaths, resolvePathTiles } from './map-gen/generators/paths.js';
import { generateObjects } from './map-gen/generators/objects.js';
import { generateBridges } from './map-gen/generators/bridges.js';
import { generateFlowers } from './map-gen/generators/decorations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/assets/maps/outdoor.json');

async function generateOutdoorMap() {
  console.log(`Generating ${MAP_WIDTH}x${MAP_HEIGHT} outdoor map...`);

  // 1. Initialize Palette
  const palette: TileData[] = [];
  const paletteMap = new Map<string, number>(); 

  function getPaletteIndex(tileId: number, set: string, type: 'tileset' | 'autoset' | 'animations'): number {
    const key = `${set}:${type}:${tileId}`;
    if (paletteMap.has(key)) return paletteMap.get(key)!;
    
    const index = palette.length;
    palette.push({ id: tileId, set, type });
    paletteMap.set(key, index);
    return index;
  }

  // Pre-fetch commonly used indices
  const grassIndex = getPaletteIndex(TILE_IDS.GRASS, TILESET_NAME, 'tileset');
  const waterIndex = getPaletteIndex(TILE_IDS.WATER, TILESET_NAME, 'tileset'); 

  // Tree Palette Indices (Resolve them all here to pass to objects gen)
  const treeIndices = {
    treeTopLeft: getPaletteIndex(TILE_IDS.TREE_TL, TILESET_NAME, 'tileset'),
    treeTopRight: getPaletteIndex(TILE_IDS.TREE_TR, TILESET_NAME, 'tileset'),
    treeMidLeft: getPaletteIndex(TILE_IDS.TREE_ML, TILESET_NAME, 'tileset'),
    treeMidRight: getPaletteIndex(TILE_IDS.TREE_MR, TILESET_NAME, 'tileset'),
    treeBotLeft: getPaletteIndex(TILE_IDS.TREE_BL, TILESET_NAME, 'tileset'),
    treeBotRight: getPaletteIndex(TILE_IDS.TREE_BR, TILESET_NAME, 'tileset'),

    treeStackL: getPaletteIndex(TILE_IDS.TREE_STACK_L, TILESET_NAME, 'tileset'),
    treeStackR: getPaletteIndex(TILE_IDS.TREE_STACK_R, TILESET_NAME, 'tileset'),

    treePine1Top: getPaletteIndex(TILE_IDS.TREE_PINE_1_TOP, TILESET_NAME, 'tileset'),
    treePine1Mid: getPaletteIndex(TILE_IDS.TREE_PINE_1_MID, TILESET_NAME, 'tileset'),
    treePine1Bot: getPaletteIndex(TILE_IDS.TREE_PINE_1_BOT, TILESET_NAME, 'tileset'),

    treePine2Top: getPaletteIndex(TILE_IDS.TREE_PINE_2_TOP, TILESET_NAME, 'tileset'),
    treePine2Mid: getPaletteIndex(TILE_IDS.TREE_PINE_2_MID, TILESET_NAME, 'tileset'),
    treePine2Bot: getPaletteIndex(TILE_IDS.TREE_PINE_2_BOT, TILESET_NAME, 'tileset'),
    treePine2Joiner: getPaletteIndex(TILE_IDS.TREE_PINE_2_JOINER, TILESET_NAME, 'tileset'),

    treeBigTL: getPaletteIndex(TILE_IDS.TREE_BIG_TL, TILESET_NAME, 'tileset'),
    treeBigTM: getPaletteIndex(TILE_IDS.TREE_BIG_TM, TILESET_NAME, 'tileset'),
    treeBigTR: getPaletteIndex(TILE_IDS.TREE_BIG_TR, TILESET_NAME, 'tileset'),
    treeBigML: getPaletteIndex(TILE_IDS.TREE_BIG_ML, TILESET_NAME, 'tileset'),
    treeBigMM: getPaletteIndex(TILE_IDS.TREE_BIG_MM, TILESET_NAME, 'tileset'),
    treeBigMR: getPaletteIndex(TILE_IDS.TREE_BIG_MR, TILESET_NAME, 'tileset'),
    treeBigBL: getPaletteIndex(TILE_IDS.TREE_BIG_BL, TILESET_NAME, 'tileset'),
    treeBigBM: getPaletteIndex(TILE_IDS.TREE_BIG_BM, TILESET_NAME, 'tileset'),
    treeBigBR: getPaletteIndex(TILE_IDS.TREE_BIG_BR, TILESET_NAME, 'tileset'),
  };

  // 2. Create Layers
  const groundTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, grassIndex);
  const objectTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, -1); 
  const decorationTiles = createEmptyLayer(MAP_WIDTH, MAP_HEIGHT, -1);
  
  // 3. Procedural Generation Steps
  
  // A. Lakes
  generateLakes(groundTiles, palette, getPaletteIndex);
  smoothWater(groundTiles, grassIndex);

  // B. Dirt
  generateDirt(groundTiles, grassIndex, getPaletteIndex);

  // C. Paths
  generatePaths(groundTiles, palette, getPaletteIndex);

  // C2. Bridges (Generate BEFORE resolution to detect Water Markers)
  generateBridges(groundTiles, objectTiles, palette, getPaletteIndex);

  // Resolution Phase (Auto-Tiles)
  resolveWaterTiles(groundTiles, getPaletteIndex);
  resolveDirtTiles(groundTiles, getPaletteIndex);
  resolvePathTiles(groundTiles, getPaletteIndex);

  // D. Objects
  generateObjects(groundTiles, objectTiles, grassIndex, getPaletteIndex, treeIndices);
  
  // E. Decorations (Flowers)
  const flowerIndices = [
    getPaletteIndex(TILE_IDS.FLOWER, TILESET_NAME, 'tileset'),
    getPaletteIndex(TILE_IDS.FLOWERS_1, 'Flowers1.png', 'animations'),
    getPaletteIndex(TILE_IDS.FLOWERS_2, 'Flowers2.png', 'animations')
  ];
  
  generateFlowers(groundTiles, objectTiles, decorationTiles, grassIndex, flowerIndices);

  // 4. Serialize & Save
  const mapData = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tileSize: TILE_SIZE,
    palette: palette,
    ground: groundTiles,
    objects: objectTiles,
    decorations: decorationTiles,
    spawnPoint: { x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) } 
  };

  // Ensure output dir exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapData, null, 2));
  console.log(`Map saved to ${OUTPUT_PATH}`);
}

generateOutdoorMap().catch(console.error);
