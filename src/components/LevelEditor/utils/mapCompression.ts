import type { TileData, CustomMapData, SerializedLayer } from '@/game/types/map';
import type { MapSize, LayerData } from '@/components/LevelEditor/types';

export const compressMapData = (
  mapSize: MapSize,
  tileSize: number,
  layers: LayerData[],
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

  const compressLayer = (tiles: TileData[][]): number[][] => {
    return tiles.map(row => row.map(tile => getPaletteIndex(tile)));
  };

  // Serialize all layers
  const serializedLayers: SerializedLayer[] = layers.map(layer => ({
    id: layer.id,
    name: layer.name,
    tiles: compressLayer(layer.tiles),
    collision: layer.collision,
  }));

  // Backward compatibility: populate ground/objects from first two layers
  const groundTiles = layers[0]?.tiles ?? [];
  const objectTiles = layers[1]?.tiles ?? [];
  const compressedGround = compressLayer(groundTiles);
  const compressedObjects = compressLayer(objectTiles);

  return {
    width: mapSize.width,
    height: mapSize.height,
    tileSize,
    palette,
    ground: compressedGround,
    objects: compressedObjects,
    layers: serializedLayers,
    spawnPoint: spawnPoint || undefined
  };
};
