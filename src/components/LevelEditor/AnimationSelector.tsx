import { useState, useEffect } from 'react';
import { TILE_ANIMATIONS } from '@/game/config/TileAnimations';
import styles from './AnimationSelector.module.css';

interface AnimationSelectorProps {
  onSelect: (set: string, startId: number) => void;
  activeAsset: string;
  activeId: number;
  imageCache: Record<string, HTMLImageElement | HTMLCanvasElement>;
}

export const AnimationSelector = ({ onSelect, activeAsset, activeId, imageCache }: AnimationSelectorProps) => {
  const [frameOffset, setFrameOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameOffset(prev => (prev + 1) % 60); // Simple global frame counter (cycle every 12 seconds at 5fps)
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.gridContainer}>
      {TILE_ANIMATIONS.map((anim, index) => {
        const asset = imageCache[anim.tileset];
        const tilesPerRow = asset ? Math.floor(asset.width / 32) : 1;
        
        const currentFrame = frameOffset % anim.frameCount;
        const localId = anim.startId + currentFrame;
        
        const srcX = (localId % tilesPerRow) * 32;
        const srcY = Math.floor(localId / tilesPerRow) * 32;

        // If it's a canvas (autoset generated), we use toDataURL
        const imgSrc = asset instanceof HTMLCanvasElement ? asset.toDataURL() : asset?.src;

        const isSelected = activeAsset === anim.tileset && activeId === anim.startId;

        return (
          <div 
            key={index}
            className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
            onClick={() => onSelect(anim.tileset, anim.startId)}
            title={`${anim.tileset} (frames: ${anim.frameCount})`}
          >
            <div 
              className={styles.preview}
              style={{
                backgroundImage: imgSrc ? `url(${imgSrc})` : undefined,
                backgroundPosition: `-${srcX}px -${srcY}px`,
                backgroundSize: asset ? `${asset.width}px ${asset.height}px` : 'cover'
              }}
            />
            <span className={`${styles.label} ${isSelected ? styles.labelSelected : ''}`}>
              {anim.tileset.replace('.png', '')}
            </span>
          </div>
        );
      })}
    </div>
  );
};
