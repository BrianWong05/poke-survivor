import { useState, useEffect, useRef } from 'react';
import { generateAutoTileTexture } from '@/components/LevelEditor/utils';

export const useAssetLibrary = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageCache = useRef<Record<string, HTMLImageElement | HTMLCanvasElement>>({});

  // Eagerly load assets
  const tilesetModules = import.meta.glob('/src/assets/Tilesets/*.png', { eager: true });
  const autosetModules = import.meta.glob('/src/assets/Autotiles/*.png', { eager: true });
  const animationModules = import.meta.glob('/src/assets/Animations/*.png', { eager: true });

  const getFileName = (path: string) => path.split('/').pop() || '';

  const assets = {
    tilesets: Object.fromEntries(Object.entries(tilesetModules).map(([p, m]) => [getFileName(p), (m as any).default])),
    autosets: Object.fromEntries(Object.entries(autosetModules).map(([p, m]) => [getFileName(p), (m as any).default])),
    animations: Object.fromEntries(Object.entries(animationModules).map(([p, m]) => [getFileName(p), (m as any).default])),
  };

  useEffect(() => {
    let loadedCount = 0;
    const total = Object.keys(assets.tilesets).length + Object.keys(assets.autosets).length + Object.keys(assets.animations).length;

    if (total === 0) {
      setImagesLoaded(true);
      return;
    }

    const storeAsset = (name: string, item: HTMLImageElement | HTMLCanvasElement) => {
      imageCache.current[name] = item;
      loadedCount++;
      if (loadedCount >= total) setImagesLoaded(true);
    };

    const load = (name: string, src: string, isAuto: boolean) => {
      if (imageCache.current[name]) {
        loadedCount++;
        if (loadedCount >= total) setImagesLoaded(true);
        return;
      }
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isAuto) {
          const canvas = generateAutoTileTexture(img);
          storeAsset(name, canvas || img);
        } else {
          storeAsset(name, img);
        }
      };
      img.onerror = () => storeAsset(name, img);
    };

    Object.entries(assets.tilesets).forEach(([n, s]) => load(n, s as string, false));
    Object.entries(assets.autosets).forEach(([n, s]) => load(n, s as string, true));
    Object.entries(assets.animations).forEach(([n, s]) => load(n, s as string, false));

  }, [assets.tilesets, assets.autosets, assets.animations]);

  return { assets, imageCache, imagesLoaded };
};