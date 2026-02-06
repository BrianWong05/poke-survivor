import { useState, useCallback } from 'react';
import type { CustomMapData } from '@/game/types/map';

export const useMapPersistence = () => {
  const [savedMaps, setSavedMaps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMaps = useCallback(async () => {
    try {
      const res = await fetch('/api/maps');
      if (res.ok) {
        const files = await res.json() as string[];
        // Strip .json for display
        setSavedMaps(files.map(f => f.replace(/\.json$/, '')));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to list maps', err);
      return false;
    }
  }, []);

  const saveMap = useCallback(async (name: string, data: CustomMapData) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data })
      });
      return res.ok;
    } catch (err) {
      console.error('Error saving map', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMap = useCallback(async (name: string): Promise<CustomMapData | null> => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/maps/${name}.json`);
      if (res.ok) {
        return await res.json() as CustomMapData;
      }
      return null;
    } catch (err) {
      console.error('Error loading map', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    savedMaps,
    fetchMaps,
    saveMap,
    loadMap,
    isLoading
  };
};
