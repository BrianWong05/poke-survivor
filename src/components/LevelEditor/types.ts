import type { TileData } from '@/game/types/map';

export type ToolType = 'brush' | 'fill' | 'eraser' | 'area-eraser' | 'spawn';
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

export interface LayerData {
  id: string;
  name: string;
  tiles: TileData[][];
  visible: boolean;
  collision: boolean;
  locked: boolean;
}

export interface EditorState {
  layers: LayerData[];
  mapSize: MapSize;
  spawnPoint: { x: number; y: number } | null;
}
