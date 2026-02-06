export interface TileAnimationData {
  tileset: string;
  startId: number; // Local ID (0-based)
  frameCount: number;
  duration: number;
}

export const TILE_ANIMATIONS: TileAnimationData[] = [
  // Specific Animation Strips
  { tileset: 'Flowers1.png', startId: 0, frameCount: 5, duration: 250 },
  { tileset: 'Flowers2.png', startId: 0, frameCount: 5, duration: 250 },
  { tileset: 'Fountain1.png', startId: 0, frameCount: 3, duration: 200 },
  { tileset: 'Fountain2.png', startId: 0, frameCount: 3, duration: 200 },
  { tileset: 'Waterfall.png', startId: 0, frameCount: 3, duration: 150 },
  { tileset: 'Waterfall crest.png', startId: 0, frameCount: 3, duration: 150 },
  { tileset: 'Waterfall bottom.png', startId: 0, frameCount: 3, duration: 150 },
];