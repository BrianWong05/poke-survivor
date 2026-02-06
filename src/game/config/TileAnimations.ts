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

  // New Environmental Animations
  { tileset: 'Black.png', startId: 0, frameCount: 4, duration: 250 },
  { tileset: 'Seaweed dark.png', startId: 0, frameCount: 4, duration: 250 },
  { tileset: 'Seaweed light.png', startId: 0, frameCount: 4, duration: 250 },
  { tileset: 'Water current east.png', startId: 0, frameCount: 8, duration: 150 },
  { tileset: 'Water current north.png', startId: 0, frameCount: 8, duration: 150 },
  { tileset: 'Water current south.png', startId: 0, frameCount: 8, duration: 150 },
  { tileset: 'Water current west.png', startId: 0, frameCount: 8, duration: 150 },
];