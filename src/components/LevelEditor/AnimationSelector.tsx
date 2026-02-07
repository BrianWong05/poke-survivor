import { useState, useEffect } from 'react';
import { TILE_ANIMATIONS } from '@/game/config/TileAnimations';

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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 p-2">
      {TILE_ANIMATIONS.map((anim, index) => {
        const asset = imageCache[anim.tileset];
        const tilesPerRow = asset ? Math.floor(asset.width / 32) : 1;
        
        const currentFrame = frameOffset % anim.frameCount;
        const localId = anim.startId + currentFrame;
        
        const srcX = (localId % tilesPerRow) * 32;
        const srcY = Math.floor(localId / tilesPerRow) * 32;

        // If it's a canvas (autoset generated), we use toDataURL
        const imgSrc = asset instanceof HTMLCanvasElement ? asset.toDataURL() : asset?.src;

        return (
          <div 
            key={index}
            className={`bg-[#333] border border-[#555] rounded cursor-pointer flex flex-col items-center justify-center p-2 px-1 gap-1.5 overflow-hidden transition-all duration-200 hover:bg-[#444] hover:border-[#777] ${activeAsset === anim.tileset && activeId === anim.startId ? 'bg-[#4CAF50] border-[#4CAF50]' : ''}`}
            onClick={() => onSelect(anim.tileset, anim.startId)}
            title={`${anim.tileset} (frames: ${anim.frameCount})`}
          >
            <div 
              className="w-8 h-8 [image-rendering:pixelated] bg-no-repeat"
              style={{
                backgroundImage: imgSrc ? `url(${imgSrc})` : undefined,
                backgroundPosition: `-${srcX}px -${srcY}px`,
                backgroundSize: asset ? `${asset.width}px ${asset.height}px` : 'cover'
              }}
            />
            <span className={`text-[0.65rem] text-center whitespace-nowrap overflow-hidden text-ellipsis w-full ${activeAsset === anim.tileset && activeId === anim.startId ? 'text-white' : 'text-[#aaa]'}`}>
              {anim.tileset.replace('.png', '')}
            </span>
          </div>
        );
      })}
    </div>
  );
};
