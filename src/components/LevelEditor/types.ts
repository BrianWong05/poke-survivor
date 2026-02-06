import type { TileData } from '@/game/types/map';

export type ToolType = 'brush' | 'fill' | 'eraser' | 'spawn';
export type LayerType = 0 | 1; // 0 = Ground, 1 = Objects
export type AssetTab = 'tileset' | 'autoset' | 'animations';

export interface SelectionState {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MapSize {
  width: number;
  height: number;
}

export interface EditorState {
  groundLayer: TileData[][];
  objectLayer: TileData[][];
  mapSize: MapSize;
  spawnPoint: { x: number; y: number } | null;
}
