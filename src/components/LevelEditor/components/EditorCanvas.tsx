import React, { useRef, useEffect, useCallback } from 'react';
import type { TileData } from '@/game/types/map';
import type { MapSize, ToolType, SelectionState, AssetTab, LayerData } from '@/components/LevelEditor/types';
import { TILE_SIZE } from '@/components/LevelEditor/constants';
import styles from './EditorCanvas.module.css';

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
  zoom: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  mapSize, layers, currentLayerId, spawnPoint, activeTool, activeAsset, activeTab, selection, imageCache, imagesLoaded,
  onPaint, onDragEnd, zoom
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
    ctx.fillStyle = '#000000';
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
        // Calculate bounds
       const startX = dragStart.current.x;
       const startY = dragStart.current.y;
       const currX = dragCurrent.current.x;
       const currY = dragCurrent.current.y;
       
       const minX = Math.min(startX, currX);
       const minY = Math.min(startY, currY);
       
       // Note: maxX/maxY are inclusive indices in logic, but for drawing rectangle width/height:
       // If dragging from 0,0 to 1,1 (2x2 tiles), width should be 2*TILE_SIZE.
       const w = (Math.abs(currX - startX) + 1) * TILE_SIZE;
       const h = (Math.abs(currY - startY) + 1) * TILE_SIZE;

       if (activeTool === 'eraser') {
         // Eraser is single tile unless grouped? Original code suggests simple erasure at current position?
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
          // Simple brush preview at current cursor
          const tile: TileData = { id: (selection.y * 100) + selection.x, set: activeAsset, type: activeTab };
          // Note: selection logic might be more complex if multi-tile selection, but sticking to original simple preview
          drawTile(ctx, tile, previewX, previewY, 0.5);
       } else if (activeTool === 'fill') {
          const maxX = Math.max(startX, currX);
          const maxY = Math.max(startY, currY);
          
          const asset = imageCache[activeAsset];
          if (asset) {
            const tilesPerRow = Math.floor(asset.width / TILE_SIZE);
            
            for (let y = minY; y <= maxY; y++) {
               for (let x = minX; x <= maxX; x++) {
                  const patternX = (x - minX) % selection.w;
                  const patternY = (y - minY) % selection.h;
                  const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
                  
                  const tile: TileData = { id: sourceId, set: activeAsset, type: activeTab };
                  drawTile(ctx, tile, x, y, 0.5);
               }
            }
          }

          ctx.strokeStyle = '#fff';
          ctx.strokeRect(minX * TILE_SIZE, minY * TILE_SIZE, w, h);
       }
    }

  }, [mapSize, layers, currentLayerId, spawnPoint, activeTool, selection, activeAsset, activeTab, drawTile, imagesLoaded]);

  useEffect(() => { render(); }, [render]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Coordinates calculation
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;
    
    const x = Math.floor(clickX / TILE_SIZE);
    const y = Math.floor(clickY / TILE_SIZE);
    
    if (x < 0 || x >= mapSize.width || y < 0 || y >= mapSize.height) return;

    isDragging.current = true;
    dragStart.current = { x, y };
    dragCurrent.current = { x, y };
    
    if (activeTool === 'brush' || activeTool === 'eraser') onPaint(x, y, false);
    render();
  }, [zoom, mapSize, activeTool, onPaint, render]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;
    
    const x = Math.floor(clickX / TILE_SIZE);
    const y = Math.floor(clickY / TILE_SIZE);

    if (x >= 0 && x < mapSize.width && y >= 0 && y < mapSize.height) {
        if (x !== dragCurrent.current.x || y !== dragCurrent.current.y) {
          dragCurrent.current = { x, y };
          if (activeTool === 'brush' || activeTool === 'eraser') onPaint(x, y, true);
          render();
        }
    }
  }, [zoom, mapSize, activeTool, onPaint, render]);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      onDragEnd(dragStart.current, dragCurrent.current);
      render();
    }
  }, [onDragEnd, render]);

  return (
    <div className={styles.container}>
      <canvas
        className={styles.canvas}
        style={{ 
            width: mapSize.width * TILE_SIZE * zoom,
            height: mapSize.height * TILE_SIZE * zoom,
            // Original used generic scale transform, but setting display size is often cleaner for canvas
            // However, original code:
            // style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            // width={mapSize.width * TILE_SIZE}
            // height={mapSize.height * TILE_SIZE}
            // If we change this, we change the coordinate logic.
            // Let's STICK TO ORIGINAL TRANSFORM LOGIC to avoid breaking mouse events logic
            transform: `scale(${zoom})`
        }}
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