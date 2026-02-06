import type { TileData } from '@/game/types/map';

export const TILE_SIZE = 32;
export const DEFAULT_WIDTH = 20;
export const DEFAULT_HEIGHT = 20;

export const EMPTY_TILE: TileData = { id: -1, set: '', type: 'tileset' };
