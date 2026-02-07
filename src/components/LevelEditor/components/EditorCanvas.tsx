import React, { useRef, useEffect, useCallback } from 'react';
import type { TileData } from '@/game/types/map';
import type { MapSize, ToolType, SelectionState, AssetTab, LayerData } from '@/components/LevelEditor/types';
import { TILE_SIZE } from '@/components/LevelEditor/constants';

interface EditorCanvasProps {
  mapSize: MapSize;
  layers: LayerData[];
  currentLayerId: string;
  spawnPoint: { x: number, y: number } | null;
  activeTool: ToolType;
  activeAsset: string;
  activeTab: AssetTab;
  selection: SelectionState;
  imageCache: Record<string, HTMLImageElement | HTMLCanvasElement>;
  imagesLoaded: boolean;

  onPaint: (x: number, y: number, isDragging: boolean) => void;
  onDragEnd: (start: {x: number, y: number}, end: {x: number, y: number}) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  mapSize, layers, currentLayerId, spawnPoint, activeTool, activeAsset, activeTab, selection, imageCache, imagesLoaded,
  onPaint, onDragEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });

  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tile: TileData, x: number, y: number, alpha: number) => {
    if (tile.id === -1) return;
    const asset = imageCache[tile.set];
    if (!asset) return;

    const tilesPerRow = Math.floor(asset.width / TILE_SIZE);
    const srcX = (tile.id % tilesPerRow) * TILE_SIZE;
    const srcY = Math.floor(tile.id / tilesPerRow) * TILE_SIZE;

    ctx.globalAlpha = alpha;
    ctx.drawImage(asset, srcX, srcY, TILE_SIZE, TILE_SIZE, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.globalAlpha = 1.0;
  }, [imageCache]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, mapSize.width * TILE_SIZE, mapSize.height * TILE_SIZE);

    // Render layers in order, skipping hidden ones; dim non-active layers
    for (const layer of layers) {
      if (!layer.visible) continue;
      const alpha = layer.id === currentLayerId ? 1.0 : 0.4;
      layer.tiles.forEach((row, y) => row.forEach((tile, x) => drawTile(ctx, tile, x, y, alpha)));
    }

    // Spawn
    if (spawnPoint) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc((spawnPoint.x + 0.5) * TILE_SIZE, (spawnPoint.y + 0.5) * TILE_SIZE, TILE_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= mapSize.width * TILE_SIZE; x += TILE_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, mapSize.height * TILE_SIZE); }
    for (let y = 0; y <= mapSize.height * TILE_SIZE; y += TILE_SIZE) { ctx.moveTo(0, y); ctx.lineTo(mapSize.width * TILE_SIZE, y); }
    ctx.stroke();

    // Preview / Drag
    if (isDragging.current) {
       const minX = Math.min(dragStart.current.x, dragCurrent.current.x);
       const minY = Math.min(dragStart.current.y, dragCurrent.current.y);
       const maxX = Math.max(dragStart.current.x, dragCurrent.current.x);
       const maxY = Math.max(dragStart.current.y, dragCurrent.current.y);

       const w = (maxX - minX + 1) * TILE_SIZE;
       const h = (maxY - minY + 1) * TILE_SIZE;

       if (activeTool === 'eraser') {
         const ex = dragCurrent.current.x;
         const ey = dragCurrent.current.y;
         ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
         ctx.fillRect(ex * TILE_SIZE, ey * TILE_SIZE, TILE_SIZE, TILE_SIZE);
         ctx.strokeStyle = '#ff0000';
         ctx.strokeRect(ex * TILE_SIZE, ey * TILE_SIZE, TILE_SIZE, TILE_SIZE);
       } else if (activeTool === 'area-eraser') {
         ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
         ctx.fillRect(minX * TILE_SIZE, minY * TILE_SIZE, w, h);
         ctx.strokeStyle = '#ff0000';
         ctx.strokeRect(minX * TILE_SIZE, minY * TILE_SIZE, w, h);
       } else if (activeTool === 'brush') {
          const previewX = dragCurrent.current.x;
          const previewY = dragCurrent.current.y;
          const tile: TileData = { id: (selection.y * 100) + selection.x, set: activeAsset, type: activeTab };
          drawTile(ctx, tile, previewX, previewY, 0.5);
       } else {
         // Box Select Preview
         ctx.strokeStyle = '#fff';
         ctx.strokeRect(minX * TILE_SIZE, minY * TILE_SIZE, w, h);
       }
    }

  }, [mapSize, layers, currentLayerId, spawnPoint, activeTool, selection, activeAsset, activeTab, drawTile, imagesLoaded]);

  useEffect(() => { render(); }, [render]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    isDragging.current = true;
    dragStart.current = { x, y };
    dragCurrent.current = { x, y };
    if (activeTool === 'brush' || activeTool === 'eraser') onPaint(x, y, false);
    render();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x !== dragCurrent.current.x || y !== dragCurrent.current.y) {
      dragCurrent.current = { x, y };
      if (activeTool === 'brush' || activeTool === 'eraser') onPaint(x, y, true);
      render();
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      onDragEnd(dragStart.current, dragCurrent.current);
      render();
    }
  };

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={mapSize.width * TILE_SIZE}
        height={mapSize.height * TILE_SIZE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
