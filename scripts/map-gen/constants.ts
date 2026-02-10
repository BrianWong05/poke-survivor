
export const MAP_WIDTH = 300;
export const MAP_HEIGHT = 300;
export const TILE_SIZE = 32;
export const TILESET_NAME = 'Outside.png';

export const TILE_IDS = {
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
  TREE_PINE_2_JOINER: 495,

  // Big Tree (3x3)
  TREE_BIG_TL: 440, TREE_BIG_TM: 441, TREE_BIG_TR: 442,
  TREE_BIG_ML: 448, TREE_BIG_MM: 449, TREE_BIG_MR: 450,
  TREE_BIG_BL: 456, TREE_BIG_BM: 457, TREE_BIG_BR: 458,

  // Water
  WATER: 250, 
  
  PATH: 25, 

  FLOWER: 31,  
  FLOWERS_1: 0,
  FLOWERS_2: 0,
  
  BRIDGE: {
    // Horizontal Span (Using 1232-1234 set)
    H_TOP: 1232,
    H_MID: 1233,
    H_BOT: 1234,

    // Vertical Span (Using 1243-1259 set)
    V_LEFT: 1243,
    V_MID: 1251,
    V_RIGHT: 1259,

    // Intersection (3x3 Block)
    CROSS_TL: 1240, CROSS_TM: 1241, CROSS_TR: 1242,
    CROSS_ML: 1248, CROSS_MM: 1249, CROSS_MR: 1250,
    CROSS_BL: 1256, CROSS_BM: 1257, CROSS_BR: 1258,
  }
};

// Internal Markers for generation phases
export const MARKERS = {
  WATER: -998,
  DIRT: -997,
  PATH: -999,
};
