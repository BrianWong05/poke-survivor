import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TileData, CustomMapData } from '@/game/types/map';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, EMPTY_TILE } from '@/components/LevelEditor/constants';
import type { MapSize, EditorState, LayerData } from '@/components/LevelEditor/types';

let layerCounter = 0;
const generateLayerId = () => `layer-${Date.now()}-${++layerCounter}`;

const createEmptyGrid = (width: number, height: number): TileData[][] =>
  Array(height).fill(0).map(() => Array(width).fill(0).map(() => ({ ...EMPTY_TILE })));

const createDefaultLayers = (width: number, height: number): LayerData[] => [
  { id: generateLayerId(), name: 'Ground', tiles: createEmptyGrid(width, height), visible: true, collision: false },
  { id: generateLayerId(), name: 'Objects', tiles: createEmptyGrid(width, height), visible: true, collision: true },
];

const normalizeGrid = (grid: (number | TileData)[][], palette?: TileData[]): TileData[][] => {
  return grid.map(row => row.map(cell => {
    if (typeof cell === 'number') {
      if (cell === -1) return { ...EMPTY_TILE };
      if (palette) {
        const tile = palette[cell];
        return tile ? { ...tile } : { ...EMPTY_TILE };
      }
      return { id: cell, set: 'Outside.png', type: 'tileset' as const };
    }
    return cell;
  }));
};

const hydrateLayersFromData = (data: CustomMapData): LayerData[] => {
  if (data.layers && data.layers.length > 0) {
    return data.layers.map(sl => ({
      id: sl.id,
      name: sl.name,
      tiles: normalizeGrid(sl.tiles, data.palette),
      visible: true,
      collision: sl.collision,
    }));
  }
  // Legacy: construct from ground/objects
  return [
    { id: generateLayerId(), name: 'Ground', tiles: normalizeGrid(data.ground, data.palette), visible: true, collision: false },
    { id: generateLayerId(), name: 'Objects', tiles: normalizeGrid(data.objects, data.palette), visible: true, collision: true },
  ];
};

export const useMapState = (initialData?: CustomMapData) => {
  const [mapSize, setMapSize] = useState<MapSize>({
    width: initialData?.width || DEFAULT_WIDTH,
    height: initialData?.height || DEFAULT_HEIGHT
  });

  const [spawnPoint, setSpawnPoint] = useState<{ x: number, y: number } | null>(initialData?.spawnPoint || null);

  const [layers, setLayers] = useState<LayerData[]>(() =>
    initialData ? hydrateLayersFromData(initialData) : createDefaultLayers(DEFAULT_WIDTH, DEFAULT_HEIGHT)
  );

  const [currentLayerId, setCurrentLayerId] = useState<string>(() => layers[0]?.id ?? '');

  // Sync initialData if it changes (e.g. returning from play test)
  useEffect(() => {
    if (initialData) {
      setMapSize({
        width: initialData.width || DEFAULT_WIDTH,
        height: initialData.height || DEFAULT_HEIGHT
      });
      setSpawnPoint(initialData.spawnPoint || null);
      const newLayers = hydrateLayersFromData(initialData);
      setLayers(newLayers);
      setCurrentLayerId(newLayers[0]?.id ?? '');
    }
  }, [initialData]);

  // History
  const [history, setHistory] = useState<EditorState[]>([]);
  const [redoStack, setRedoStack] = useState<EditorState[]>([]);

  const saveHistory = useCallback(() => {
    const currentState: EditorState = {
      layers: layers.map(l => ({ ...l, tiles: l.tiles.map(r => [...r]) })),
      mapSize,
      spawnPoint
    };
    setHistory(prev => {
      const next = [...prev, currentState];
      if (next.length > 50) next.shift();
      return next;
    });
    setRedoStack([]);
  }, [layers, mapSize, spawnPoint]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const current: EditorState = {
      layers: layers.map(l => ({ ...l, tiles: l.tiles.map(r => [...r]) })),
      mapSize,
      spawnPoint
    };

    setRedoStack(prev => [...prev, current]);
    setHistory(prev => prev.slice(0, -1));

    setLayers(last.layers);
    setMapSize(last.mapSize);
    setSpawnPoint(last.spawnPoint);
    // Ensure currentLayerId is valid after undo
    setCurrentLayerId(prev => {
      if (last.layers.some(l => l.id === prev)) return prev;
      return last.layers[0]?.id ?? '';
    });
  }, [history, layers, mapSize, spawnPoint]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const current: EditorState = {
      layers: layers.map(l => ({ ...l, tiles: l.tiles.map(r => [...r]) })),
      mapSize,
      spawnPoint
    };

    setHistory(prev => [...prev, current]);
    setRedoStack(prev => prev.slice(0, -1));

    setLayers(next.layers);
    setMapSize(next.mapSize);
    setSpawnPoint(next.spawnPoint);
    setCurrentLayerId(prev => {
      if (next.layers.some(l => l.id === prev)) return prev;
      return next.layers[0]?.id ?? '';
    });
  }, [redoStack, layers, mapSize, spawnPoint]);

  const resizeMap = useCallback((w: number, h: number) => {
    const newW = Math.max(5, Math.min(100, w));
    const newH = Math.max(5, Math.min(100, h));
    setMapSize({ width: newW, height: newH });

    setLayers(prev => prev.map(layer => ({
      ...layer,
      tiles: Array(newH).fill(0).map((_, y) =>
        Array(newW).fill(0).map((_, x) =>
          (y < layer.tiles.length && x < layer.tiles[0].length) ? layer.tiles[y][x] : { ...EMPTY_TILE }
        )
      )
    })));
  }, []);

  // Layer management
  const addLayer = useCallback(() => {
    const newLayer: LayerData = {
      id: generateLayerId(),
      name: `Layer ${layers.length + 1}`,
      tiles: createEmptyGrid(mapSize.width, mapSize.height),
      visible: true,
      collision: false,
    };
    setLayers(prev => [...prev, newLayer]);
    setCurrentLayerId(newLayer.id);
  }, [layers.length, mapSize]);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(l => l.id === id);
      if (idx === -1) return prev;
      const next = prev.filter(l => l.id !== id);
      // Adjust active layer if needed
      setCurrentLayerId(curr => {
        if (curr !== id) return curr;
        const nearestIdx = Math.min(idx, next.length - 1);
        return next[nearestIdx]?.id ?? '';
      });
      return next;
    });
  }, []);

  const renameLayer = useCallback((id: string, name: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, name } : l));
  }, []);

  const reorderLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const idx = prev.findIndex(l => l.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const toggleLayerCollision = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, collision: !l.collision } : l));
  }, []);

  // Computed: current layer tiles
  const currentLayerTiles = useMemo(() => {
    const layer = layers.find(l => l.id === currentLayerId);
    return layer?.tiles ?? createEmptyGrid(mapSize.width, mapSize.height);
  }, [layers, currentLayerId, mapSize]);

  // Setter: update current layer's tile grid
  const setCurrentLayerTiles = useCallback((updater: TileData[][] | ((prev: TileData[][]) => TileData[][])) => {
    setLayers(prev => prev.map(l => {
      if (l.id !== currentLayerId) return l;
      const newTiles = typeof updater === 'function' ? updater(l.tiles) : updater;
      return { ...l, tiles: newTiles };
    }));
  }, [currentLayerId]);

  // Hydration Method
  const loadFromData = useCallback((data: CustomMapData) => {
    if (data.width && data.height) {
      setMapSize({ width: data.width, height: data.height });
      setSpawnPoint(data.spawnPoint || null);
      const newLayers = hydrateLayersFromData(data);
      setLayers(newLayers);
      setCurrentLayerId(newLayers[0]?.id ?? '');
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          redo();
        } else if (e.key === 'z') {
          e.preventDefault();
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  return {
    layers, setLayers,
    currentLayerId, setCurrentLayerId,
    currentLayerTiles, setCurrentLayerTiles,
    mapSize, resizeMap,
    spawnPoint, setSpawnPoint,
    history, redoStack,
    saveHistory, undo, redo,
    addLayer, removeLayer, renameLayer, reorderLayer,
    toggleLayerVisibility, toggleLayerCollision,
    loadFromData,
  };
};
