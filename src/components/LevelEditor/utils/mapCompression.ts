import type { TileData, CustomMapData } from '@/game/types/map';
import type { MapSize } from '@/components/LevelEditor/types';

export const compressMapData = (
  mapSize: MapSize,
  tileSize: number,
  groundLayer: TileData[][],
  objectLayer: TileData[][],
  spawnPoint: { x: number, y: number } | null
): CustomMapData => {
  const palette: TileData[] = [];
  const paletteMap = new Map<string, number>(); // Key: "id:set:type", Value: PaletteIndex

  const getPaletteIndex = (tile: TileData): number => {
    if (tile.id === -1) return -1;
    const key = `${tile.id}:${tile.set}:${tile.type}`;
    if (paletteMap.has(key)) return paletteMap.get(key)!;

    const newIndex = palette.length;
    palette.push(tile);
    paletteMap.set(key, newIndex);
    return newIndex;
  };

  const compressLayer = (layer: TileData[][]): number[][] => {
    return layer.map(row => row.map(tile => getPaletteIndex(tile)));
  };

  const compressedGround = compressLayer(groundLayer);
  const compressedObjects = compressLayer(objectLayer);

  return {
    width: mapSize.width,
    height: mapSize.height,
    tileSize,
    palette,
    ground: compressedGround,
    objects: compressedObjects,
    spawnPoint: spawnPoint || undefined
  };
};
