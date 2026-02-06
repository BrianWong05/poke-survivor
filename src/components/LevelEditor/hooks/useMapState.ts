import { useState, useCallback, useEffect } from 'react';
import type { TileData, CustomMapData } from '@/game/types/map';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, EMPTY_TILE } from '@/components/LevelEditor/constants';
import type { MapSize, EditorState } from '@/components/LevelEditor/types';

export const useMapState = (initialData?: CustomMapData) => {
  
  const normalizeGrid = useCallback((grid: (number | TileData)[][], palette?: TileData[]): TileData[][] => {
    return grid.map(row => row.map(cell => {
      if (typeof cell === 'number') {
        if (cell === -1) return { ...EMPTY_TILE };
        // If palette exists, look up the tile, otherwise assume tileset
        if (palette) {
            const tile = palette[cell];
            return tile ? { ...tile } : { ...EMPTY_TILE };
        }
        return { id: cell, set: 'Outside.png', type: 'tileset' };
      }
      return cell;
    }));
  }, []);

  const [mapSize, setMapSize] = useState<MapSize>({
    width: initialData?.width || DEFAULT_WIDTH,
    height: initialData?.height || DEFAULT_HEIGHT
  });

  const [spawnPoint, setSpawnPoint] = useState<{ x: number, y: number } | null>(initialData?.spawnPoint || null);

  const [groundLayer, setGroundLayer] = useState<TileData[][]>(() => 
    initialData?.ground 
      ? normalizeGrid(initialData.ground, initialData.palette) 
      : Array(initialData?.height || DEFAULT_HEIGHT).fill(0).map(() => Array(initialData?.width || DEFAULT_WIDTH).fill({ ...EMPTY_TILE }))
  );

  const [objectLayer, setObjectLayer] = useState<TileData[][]>(() => 
    initialData?.objects 
      ? normalizeGrid(initialData.objects, initialData.palette) 
      : Array(initialData?.height || DEFAULT_HEIGHT).fill(0).map(() => Array(initialData?.width || DEFAULT_WIDTH).fill({ ...EMPTY_TILE }))
  );

  // Sync initialData if it changes (e.g. returning from play test)
  useEffect(() => {
    if (initialData) {
      setMapSize({ 
        width: initialData.width || DEFAULT_WIDTH, 
        height: initialData.height || DEFAULT_HEIGHT 
      });
      setSpawnPoint(initialData.spawnPoint || null);
      setGroundLayer(normalizeGrid(initialData.ground, initialData.palette));
      setObjectLayer(normalizeGrid(initialData.objects, initialData.palette));
    }
  }, [initialData, normalizeGrid]);

  // History
  const [history, setHistory] = useState<EditorState[]>([]);
  const [redoStack, setRedoStack] = useState<EditorState[]>([]);

  const saveHistory = useCallback(() => {
    const currentState: EditorState = {
      groundLayer: groundLayer.map(r => [...r]),
      objectLayer: objectLayer.map(r => [...r]),
      mapSize,
      spawnPoint
    };
    setHistory(prev => {
      const next = [...prev, currentState];
      if (next.length > 50) next.shift();
      return next;
    });
    setRedoStack([]);
  }, [groundLayer, objectLayer, mapSize, spawnPoint]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const current: EditorState = { groundLayer, objectLayer, mapSize, spawnPoint };
    
    setRedoStack(prev => [...prev, current]);
    setHistory(prev => prev.slice(0, -1));
    
    setGroundLayer(last.groundLayer);
    setObjectLayer(last.objectLayer);
    setMapSize(last.mapSize);
    setSpawnPoint(last.spawnPoint);
  }, [history, groundLayer, objectLayer, mapSize, spawnPoint]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const current: EditorState = { groundLayer, objectLayer, mapSize, spawnPoint };

    setHistory(prev => [...prev, current]);
    setRedoStack(prev => prev.slice(0, -1));

    setGroundLayer(next.groundLayer);
    setObjectLayer(next.objectLayer);
    setMapSize(next.mapSize);
    setSpawnPoint(next.spawnPoint);
  }, [redoStack, groundLayer, objectLayer, mapSize, spawnPoint]);

  const resizeMap = useCallback((w: number, h: number) => {
    const newW = Math.max(5, Math.min(100, w));
    const newH = Math.max(5, Math.min(100, h));
    setMapSize({ width: newW, height: newH });

    const resizeLayer = (layer: TileData[][]) => Array(newH).fill(0).map((_, y) => 
      Array(newW).fill(0).map((_, x) => 
        (y < layer.length && x < layer[0].length) ? layer[y][x] : { ...EMPTY_TILE }
      )
    );

    setGroundLayer(prev => resizeLayer(prev));
    setObjectLayer(prev => resizeLayer(prev));
  }, []);

  // Hydration Method
  const loadFromData = useCallback((data: CustomMapData) => {
    if (data.width && data.height) {
        setMapSize({ width: data.width, height: data.height });
        setSpawnPoint(data.spawnPoint || null);
        setGroundLayer(normalizeGrid(data.ground, data.palette));
        setObjectLayer(normalizeGrid(data.objects, data.palette));
    }
  }, [normalizeGrid]);

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
    groundLayer, setGroundLayer,
    objectLayer, setObjectLayer,
    mapSize, resizeMap,
    spawnPoint, setSpawnPoint,
    history, redoStack,
    saveHistory, undo, redo,
    loadFromData // Exported for use in index.tsx
  };
};
