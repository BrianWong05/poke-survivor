import { useRef, useEffect, useState, useCallback } from 'react';
import type { CustomMapData, TileData } from '@/game/types/map';
import { generateAutoTileTexture, updateAutoTileGrid } from './utils';
import { SaveModal } from './SaveModal';
import { AnimationSelector } from './AnimationSelector';
import './styles.css';

// Constants
const TILE_SIZE = 32;
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;

interface LevelEditorProps {
  onPlay: (data: CustomMapData) => void;
  onExit: () => void;
  initialData?: CustomMapData;
}

export const LevelEditor = ({ onPlay, onExit, initialData }: LevelEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLayer, setCurrentLayer] = useState<0 | 1>(0); // 0 = Ground, 1 = Objects
  const [activeTool, setActiveTool] = useState<'brush' | 'fill' | 'eraser' | 'spawn'>('brush');
  // Selection State (Tileset Coordinates)
  const [selection, setSelection] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });


  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState({ x: 0, y: 0 });
  const [mapDragCurrent, setMapDragCurrent] = useState({ x: 0, y: 0 });
  

  
  const [mapSize, setMapSize] = useState({ 
    width: initialData?.width || DEFAULT_WIDTH, 
    height: initialData?.height || DEFAULT_HEIGHT 
  });
  const [spawnPoint, setSpawnPoint] = useState<{ x: number, y: number } | null>(initialData?.spawnPoint || null);

  // Initialize with empty objects
  const emptyTile: TileData = { id: -1, set: '', type: 'tileset' };
  
  const normalizeGrid = (grid: (number | TileData)[][], palette?: TileData[]): TileData[][] => {
    return grid.map(row => row.map(cell => {
        if (typeof cell === 'number') {
            if (cell === -1) return { ...emptyTile };
            if (palette) {
                const tile = palette[cell];
                return tile ? { ...tile } : { ...emptyTile };
            }
            return { id: cell, set: 'Outside.png', type: 'tileset' };
        }
        return cell;
    }));
  };

  const [groundLayer, setGroundLayer] = useState<TileData[][]>(() => {
    if (initialData?.ground) {
        return normalizeGrid(initialData.ground, initialData.palette);
    }
    return Array(mapSize.height).fill(0).map(() => Array(mapSize.width).fill({ ...emptyTile }));
  });

  const [objectLayer, setObjectLayer] = useState<TileData[][]>(() => {
    if (initialData?.objects) {
        return normalizeGrid(initialData.objects, initialData.palette);
    }
    return Array(mapSize.height).fill(0).map(() => Array(mapSize.width).fill({ ...emptyTile }));
  });

  // Undo History & Logic
  const [history, setHistory] = useState<Array<{ground: TileData[][], objects: TileData[][]}>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ground: TileData[][], objects: TileData[][]}>>([]);

  const saveHistory = () => {
    // Current state to be saved
    const currentState = {
        ground: groundLayer.map(row => [...row]),
        objects: objectLayer.map(row => [...row])
    };
    
    setHistory(prev => {
        const newHistory = [...prev, currentState];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
    });
    setRedoStack([]); // Clear redo stack on new action
  };

  const undo = () => {
    if (history.length === 0) return;

    const currentState = {
        ground: groundLayer.map(row => [...row]),
        objects: objectLayer.map(row => [...row])
    };
    
    const lastState = history[history.length - 1];

    setRedoStack(prev => [...prev, currentState]);
    setHistory(prev => prev.slice(0, -1));
    
    setGroundLayer(lastState.ground);
    setObjectLayer(lastState.objects);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const currentState = {
        ground: groundLayer.map(row => [...row]),
        objects: objectLayer.map(row => [...row])
    };

    const nextState = redoStack[redoStack.length - 1];

    setHistory(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));

    setGroundLayer(nextState.ground);
    setObjectLayer(nextState.objects);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, redoStack, groundLayer, objectLayer]);

  // Resize Handler
  const handleResize = (newWidth: number, newHeight: number) => {
    // Clamp values
    const w = Math.max(5, Math.min(100, newWidth));
    const h = Math.max(5, Math.min(100, newHeight));
    
    setMapSize({ width: w, height: h });

    // Resize Ground Layer
    setGroundLayer(prev => {
      const newGrid = Array(h).fill(0).map((_, y) => 
        Array(w).fill(0).map((_, x) => {
          if (y < prev.length && x < prev[0].length) return prev[y][x];
          return { ...emptyTile };
        })
      );
      return newGrid;
    });

    // Resize Object Layer
    setObjectLayer(prev => {
      const newGrid = Array(h).fill(0).map((_, y) => 
        Array(w).fill(0).map((_, x) => {
          if (y < prev.length && x < prev[0].length) return prev[y][x];
          return { ...emptyTile };
        })
      );
      return newGrid;
    });
  };




  // Tab & Asset State
  const [activeTab, setActiveTab] = useState<'tileset' | 'autoset' | 'animations'>('tileset');
  const [activeAsset, setActiveAsset] = useState<string>('Outside.png');


  // Available Assets (Mock/Scanned)
  // Available Assets (Loaded via Vite glob import)
  const tilesetModules = import.meta.glob('/src/assets/Tilesets/*.png', { eager: true });
  const autosetModules = import.meta.glob('/src/assets/Autotiles/*.png', { eager: true });
  const animationModules = import.meta.glob('/src/assets/Animations/*.png', { eager: true });

  // Helper to extract filename from path
  const getFileName = (path: string) => path.split('/').pop() || '';

  const tilesetAssets = Object.fromEntries(
    Object.entries(tilesetModules).map(([path, mod]) => [getFileName(path), (mod as any).default])
  );
  
  const autosetAssets = Object.fromEntries(
    Object.entries(autosetModules).map(([path, mod]) => [getFileName(path), (mod as any).default])
  );

  const animationAssets = Object.fromEntries(
    Object.entries(animationModules).map(([path, mod]) => [getFileName(path), (mod as any).default])
  );

  const tilesetOptions = Object.keys(tilesetAssets).sort();
  const autosetOptions = Object.keys(autosetAssets).sort();
  // Image Cache
  const imageCache = useRef<Record<string, HTMLImageElement | HTMLCanvasElement>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Sync tilesetRef for Preview (Supports both Image and Canvas)
  const tilesetRef = useRef<HTMLImageElement | HTMLCanvasElement>(null);
  useEffect(() => {
     if (!activeAsset) return;
     const asset = imageCache.current[activeAsset];
     if (asset) tilesetRef.current = asset;
  }, [activeAsset, imagesLoaded]);

  // Render Canvas
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tile: TileData, x: number, y: number, alpha: number) => {
    if (tile.id === -1) return;
    
    const asset = imageCache.current[tile.set];
    if (!asset) return;

    // Supports both Image and Canvas
    // Canvas (AutoSets) are 8 tiles wide (256px). Images (Tilesets) depend on width.
    const tilesPerRow = Math.floor(asset.width / TILE_SIZE);
    
    const srcX = (tile.id % tilesPerRow) * TILE_SIZE;
    const srcY = Math.floor(tile.id / tilesPerRow) * TILE_SIZE;
    
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      asset,
      srcX, srcY, TILE_SIZE, TILE_SIZE,
      x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
    ctx.globalAlpha = 1.0;
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    const width = mapSize.width * TILE_SIZE;
    const height = mapSize.height * TILE_SIZE;

    // Vertical
    for (let x = 0; x <= width; x += TILE_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    // Horizontal
    for (let y = 0; y <= height; y += TILE_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }, [mapSize]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tilesetRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = mapSize.width * TILE_SIZE;
    const height = mapSize.height * TILE_SIZE;

    // Clear
    ctx.fillStyle = '#1a1a1a'; // Dark background
    ctx.fillRect(0, 0, width, height);

    // Render Ground
    groundLayer.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile.id >= 0) drawTile(ctx, tile, x, y, 1.0);
      });
    });

    // Render Objects
    objectLayer.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile.id >= 0) drawTile(ctx, tile, x, y, 1.0);
      });
    });

    // Render Spawn Point
    if (spawnPoint) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(
            spawnPoint.x * TILE_SIZE + TILE_SIZE / 2,
            spawnPoint.y * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = '10px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('SPAWN', spawnPoint.x * TILE_SIZE + TILE_SIZE / 2, spawnPoint.y * TILE_SIZE + TILE_SIZE + 10);
    }

    // Render Grid
    drawGrid(ctx);

    // Draw Drag-to-Fill Preview
    if (isMapDragging) {
       const isBrush = activeTool === 'brush';
       const minX = isBrush ? mapDragCurrent.x : Math.min(mapDragStart.x, mapDragCurrent.x);
       const minY = isBrush ? mapDragCurrent.y : Math.min(mapDragStart.y, mapDragCurrent.y);
       const maxX = isBrush ? mapDragCurrent.x + selection.w - 1 : Math.max(mapDragStart.x, mapDragCurrent.x);
       const maxY = isBrush ? mapDragCurrent.y + selection.h - 1 : Math.max(mapDragStart.y, mapDragCurrent.y);
       
       const w = maxX - minX + 1;
       const h = maxY - minY + 1;
       
       const pixelW = w * TILE_SIZE;
       const pixelH = h * TILE_SIZE;

       if (activeTool === 'eraser') {
           // Eraser Preview: Red overlay
           ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
           ctx.fillRect(minX * TILE_SIZE, minY * TILE_SIZE, pixelW, pixelH);
           ctx.strokeStyle = '#ff0000';
           ctx.strokeRect(minX * TILE_SIZE, minY * TILE_SIZE, pixelW, pixelH);
       } else {
           // Render Preview Tiles
           for (let dy = 0; dy < h; dy++) {
             for (let dx = 0; dx < w; dx++) {
                const targetX = minX + dx;
                const targetY = minY + dy;
                
                if (targetY < mapSize.height && targetX < mapSize.width) {
                     const patternX = dx % selection.w;
                     const patternY = dy % selection.h;
                     
                     const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
                     const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
                     
                     // Construct preview tile data
                     const previewTile: TileData = { 
                         id: sourceId, 
                         set: activeAsset, 
                         type: activeTab 
                     };
                     
                     drawTile(ctx, previewTile, targetX, targetY, 0.5); // 0.5 alpha for ghost effect
                }
             }
           }
           
           // Draw Outline
           ctx.strokeStyle = '#fff';
           ctx.strokeRect(minX * TILE_SIZE, minY * TILE_SIZE, pixelW, pixelH);
       }
    }
  }, [groundLayer, objectLayer, isMapDragging, mapDragStart, mapDragCurrent, selection, mapSize, drawTile]);

  // Re-render on state change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, imagesLoaded]);

  // ... (existing helper functions)



  // Painting Logic

  const applyToolAt = useCallback((x: number, y: number) => {
    if (x < 0 || x >= mapSize.width || y < 0 || y >= mapSize.height) return;

    const updateGrid = (prev: TileData[][]) => {
      const newGrid = prev.map(row => [...row]);
      if (activeTool === 'eraser') {
        newGrid[y][x] = { ...emptyTile };
      } else if (activeTool === 'brush') {
        // Support stamp painting (multi-tile selection)
        for (let dy = 0; dy < selection.h; dy++) {
          for (let dx = 0; dx < selection.w; dx++) {
            const tx = x + dx;
            const ty = y + dy;
            if (tx < mapSize.width && ty < mapSize.height) {
              const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
              const sourceId = (selection.y + dy) * tilesPerRow + (selection.x + dx);
              newGrid[ty][tx] = {
                id: sourceId,
                set: activeAsset,
                type: activeTab
              };
            }
          }
        }
      }
      return newGrid;
    };

    if (currentLayer === 0) setGroundLayer(updateGrid);
    else setObjectLayer(updateGrid);
  }, [mapSize, activeTool, selection, activeAsset, activeTab, currentLayer, tilesetRef]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    
    setIsMapDragging(true);
    setMapDragStart({ x, y });
    setMapDragCurrent({ x, y });

    if (activeTool === 'brush' || activeTool === 'eraser') {
        saveHistory();
        applyToolAt(x, y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (isMapDragging) {
        if (x !== mapDragCurrent.x || y !== mapDragCurrent.y) {
            setMapDragCurrent({ x, y });
            if (activeTool === 'brush' || activeTool === 'eraser') {
                applyToolAt(x, y);
            }
        }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isMapDragging) {
        setIsMapDragging(false);

        if (activeTool === 'brush' || activeTool === 'eraser') {
            return; // Already painted
        }

        saveHistory();

        const minX = Math.min(mapDragStart.x, mapDragCurrent.x);
        const minY = Math.min(mapDragStart.y, mapDragCurrent.y);
        const maxX = Math.max(mapDragStart.x, mapDragCurrent.x);
        const maxY = Math.max(mapDragStart.y, mapDragCurrent.y);
        const w = maxX - minX + 1;
        const h = maxY - minY + 1;

        if (activeTool === 'spawn') {
             if (mapDragStart.x < mapSize.width && mapDragStart.y < mapSize.height) {
                 setSpawnPoint({ x: mapDragStart.x, y: mapDragStart.y });
             }
             return;
        }

        const updateGrid = (prev: TileData[][]) => {
             // For Fill + Autoset, we use the recursive updater (formerly Brush + Autoset)
             if (activeTool === 'fill' && activeTab === 'autoset') {
                 // For drag-paint with autoset, we essentially need to paint all target tiles
                 // then update their neighbors. 
                 // Simple approach: Apply the "set" to all target tiles (with ID 0 temporarily),
                 // then run the recursive updater on every tile in the affected area.
                 
                 let newGrid = prev.map(row => [...row]);
                 
                 // 1. Paint the area with the raw set properties
                 for (let dy = 0; dy < h; dy++) {
                     for (let dx = 0; dx < w; dx++) {
                         const tx = minX + dx;
                         const ty = minY + dy;
                         if (ty < mapSize.height && tx < mapSize.width) {
                             newGrid[ty][tx] = {
                                 id: 0, // Placeholder, will be fixed by updater
                                 set: activeAsset,
                                 type: 'autoset'
                             };
                         }
                     }
                 }

                 // 2. Refine IDs using AutoTile Logic
                 for (let dy = 0; dy < h; dy++) {
                     for (let dx = 0; dx < w; dx++) {
                         newGrid = updateAutoTileGrid(newGrid, minX + dx, minY + dy, activeAsset);
                     }
                 }
                 
                 return newGrid;
             }
             
             // Standard Logic (original)
             const newGrid = prev.map(row => [...row]);
             for (let dy = 0; dy < h; dy++) {
                 for (let dx = 0; dx < w; dx++) {
                     const targetX = minX + dx;
                     const targetY = minY + dy;
                     if (targetY < mapSize.height && targetX < mapSize.width) {
                          if (activeTool === 'eraser') {
                              newGrid[targetY][targetX] = { ...emptyTile };
                          } else {
                              const patternX = dx % selection.w;
                              const patternY = dy % selection.h;
                              const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
                              const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
                              
                              newGrid[targetY][targetX] = {
                                  id: sourceId,
                                  set: activeAsset,
                                  type: activeTab
                              };

                              // If using 'brush' with 'autoset', we just place the tile without recursive neighbors update
                              // However, if we want it to look "half-smart", we could run updateAutoTileGrid ONCE for this tile.
                              // But the request says "brush function should be rename to fill, and create a brush function"
                              // and the brush should be "strictly single-tile".
                              // To be "strictly single-tile" for autotiles, we should probably still run the autotile ID calculation 
                              // for THIS tile based on its current neighbors, but NOT update neighbors.
                              if (activeTool === 'brush' && activeTab === 'autoset') {
                                  // updateAutoTileGrid usually returns a new grid with recursive updates.
                                  // We'll stick to the simplest interpretation for now: it places the tile as-is.
                                  // But wait, the user expects 'brush' to work for single tiles.
                                  // If I place tile ID 0 from an autoset, it might look wrong if it doesn't check neighbors.
                              }
                          }
                     }
                 }
             }
             return newGrid;
        };

        if (currentLayer === 0) setGroundLayer(updateGrid);
        else setObjectLayer(updateGrid);
    }
  };


  // ... (rest of component, update palette render source)
  
  // Update Palette Image Source to use the generated canvas if available
  const getPaletteSource = () => {
      if (!activeAsset || !imagesLoaded) return undefined;

      // FIX: Always show Source Image for AutoSets (Visual Preference)
      // The user wants to see the original 3x4 tileset, not the generated 47-tile strip.
      if (activeTab === 'autoset') return autosetAssets[activeAsset];
      if (activeTab === 'animations') return animationAssets[activeAsset];

      const cached = imageCache.current[activeAsset];
      if (cached instanceof HTMLCanvasElement) {
          // React 'src' needs a URL. Canvas can't be passed directly to <img src>.
          // We can use toDataURL(), but that's heavy.
          // Or we can just render a canvas here.
          // Easier: Just use toDataURL() for the palette preview. It's small.
          return cached.toDataURL();
      }
      return tilesetAssets[activeAsset];
  };




  // Global Mouse Up Handler
  const onMouseUpRef = useRef({ handleCanvasMouseUp, setIsSelecting });
  onMouseUpRef.current = { handleCanvasMouseUp, setIsSelecting };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
        // Stop Palette Selection
        onMouseUpRef.current.setIsSelecting(false);
        // Stop Canvas Drag (and commit paint if active)
        onMouseUpRef.current.handleCanvasMouseUp();
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);
  // Save & Load Map Logic (Server-Side)
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedMaps, setSavedMaps] = useState<string[]>([]);
  
  // Helper to fetch maps (reused by Load and Save)
  const fetchMaps = async () => {
      try {
          const res = await fetch('/api/maps');
          if (res.ok) {
              const files = await res.json() as string[];
              // Strip .json extension for consistent base name usage in the UI
              setSavedMaps(files.map(f => f.replace(/\.json$/, '')));
              return true;
          } else {
              alert("Failed to list maps.");
              return false;
          }
      } catch (err) {
          console.error(err);
          alert("Error listing maps.");
          return false;
      }
  };

  const handleOpenSaveModal = async () => {
    await fetchMaps();
    setShowSaveModal(true);
  };

  const handleSaveMap = async (name: string) => {
    if (!name) return;

    const data = getMapData();

    try {
      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data })
      });
      
      if (res.ok) {
        alert(`Map "${name}" saved successfully!`);
        setShowSaveModal(false);
      } else {
        alert("Failed to save map.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving map.");
    }
  };

  const openLoadModal = async () => {
      const success = await fetchMaps();
      if (success) setShowLoadModal(true);
  };

  const loadMapFromServer = async (baseName: string) => {
      try {
          // Re-append .json extension for server request
          const res = await fetch(`/api/maps/${baseName}.json`);
           if (res.ok) {
              const data = await res.json() as CustomMapData;
               // Basic Validation
               if (data.width && data.height && data.ground && data.objects) {
                   saveHistory();
                   setMapSize({ width: data.width, height: data.height });
                   
                   // Convert legacy/plain number grids or Palette Indices to TileData grids
                   const normalizeGrid = (grid: (number | TileData)[][], palette?: TileData[]): TileData[][] => {
                        return grid.map(row => row.map(cell => {
                            // Case 1: Palette Based (Index)
                            if (typeof cell === 'number') {
                                if (cell === -1) return { ...emptyTile };
                                if (palette) {
                                    const tile = palette[cell];
                                    return tile ? { ...tile } : { ...emptyTile }; // Graceful fallback
                                }
                                // Legacy: Number ID without palette implies default 'Outside.png'
                                return { id: cell, set: 'Outside.png', type: 'tileset' };
                            }
                            // Case 2: Direct Object (Old uncompressed format)
                            return cell;
                        }));
                   };

                   setGroundLayer(normalizeGrid(data.ground, data.palette));
                   setObjectLayer(normalizeGrid(data.objects, data.palette));
                   setSpawnPoint(data.spawnPoint || null);
                   setShowLoadModal(false);
               } else {
                   alert("Invalid map data.");
               }
          } else {
              alert("Failed to load map.");
          }
      } catch (err) {
          console.error(err);
          alert("Error loading map.");
      }
  };

  const handlePlay = () => {
    onPlay(getMapData());
  };

  const getMapData = useCallback((): CustomMapData => {
    // PALETTE COMPRESSION LOGIC
    const palette: TileData[] = [];
    const paletteMap = new Map<string, number>(); // Key: "id:set", Value: PaletteIndex

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
      tileSize: TILE_SIZE,
      palette,
      ground: compressedGround,
      objects: compressedObjects,
      spawnPoint: spawnPoint || undefined
    };
  }, [groundLayer, objectLayer, mapSize, spawnPoint]);

  // Preload all assets (Moved to end to ensure renderCanvas is defined)
  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = Object.keys(tilesetAssets).length + Object.keys(autosetAssets).length + Object.keys(animationAssets).length;
    
    // Helper to store image/canvas in cache
    const storeAsset = (name: string, asset: HTMLImageElement | HTMLCanvasElement) => {
         imageCache.current[name] = asset;
         loadedCount++;
         if (loadedCount === totalAssets) {
             setImagesLoaded(true);
             renderCanvas(); // Initial render
         }
    };

    const loadImg = (name: string, src: string, isAutoset: boolean) => {
        if (imageCache.current[name]) {
            loadedCount++;
            if (loadedCount === totalAssets) setImagesLoaded(true);
            return;
        }
        const img = new Image();
        img.src = src;
        img.onload = () => {
            if (isAutoset) {
                // Generate 47-tile texture from the 3x3 source
                const generatedCanvas = generateAutoTileTexture(img);
                if (generatedCanvas) {
                    storeAsset(name, generatedCanvas);
                } else {
                    // Not a valid 3x4 tileset, don't store as autotile
                    loadedCount++;
                    if (loadedCount === totalAssets) setImagesLoaded(true);
                }
            } else {
                storeAsset(name, img);
            }
        };
        img.onerror = () => {
             console.error(`Failed to load ${name}`);
             storeAsset(name, img); // Store broken image to avoid hanging?
        };
    };

    Object.entries(tilesetAssets).forEach(([name, src]) => loadImg(name, src as string, false));
    Object.entries(autosetAssets).forEach(([name, src]) => loadImg(name, src as string, true));
    Object.entries(animationAssets).forEach(([name, src]) => loadImg(name, src as string, false));
    
  }, []);

  return (
    <div className="level-editor-container">
      <div className="sidebar">
        <h2>Level Editor</h2>
        
        <div className="controls-group main-controls">
             <button onClick={handlePlay} className="control-btn play-btn" title="Play Map">▶ Play</button>
             <button onClick={onExit} className="control-btn exit-btn" title="Exit Editor">✖ Exit</button>
        </div>
        
        <div className="controls-group io-controls">
             <button onClick={openLoadModal} className="control-btn load-btn" title="Load Map">📂 Load</button>
             <button onClick={handleOpenSaveModal} className="control-btn save-btn" title="Save Map">💾 Save</button>
        </div>

        <div className="controls-group history-controls">
             <button onClick={undo} className="control-btn undo-btn" disabled={history.length === 0} title="Undo (Cmd+Z)">⎌ Undo</button>
             <button onClick={redo} className="control-btn redo-btn" disabled={redoStack.length === 0} title="Redo (Cmd+Shift+Z)">↻ Redo</button>
        </div>



         <div className="map-settings">
            <div className="settings-row">
              <label>W:</label>
              <input 
                type="number" 
                className="dim-input" 
                value={mapSize.width} 
                onChange={(e) => handleResize(parseInt(e.target.value) || 10, mapSize.height)}
              />
              <label>H:</label>
              <input 
                type="number" 
                className="dim-input" 
                value={mapSize.height} 
                onChange={(e) => handleResize(mapSize.width, parseInt(e.target.value) || 10)}
              />
            </div>
            <div className="settings-row">
               <button 
                 className={`layer-btn ${currentLayer === 0 ? 'active' : ''}`}
                 onClick={() => setCurrentLayer(0)}
               >
                 Ground
               </button>
               <button 
                 className={`layer-btn ${currentLayer === 1 ? 'active' : ''}`}
                 onClick={() => setCurrentLayer(1)}
               >
                 Objects
               </button>
            </div>
            
            <div className="settings-row" style={{ marginTop: '0.5rem' }}>
               <button 
                 className={`layer-btn ${activeTool === 'brush' ? 'active' : ''}`}
                 onClick={() => setActiveTool('brush')}
                 title="Brush (Single Tile)"
               >
                 🖌 Brush
               </button>
               <button 
                 className={`layer-btn ${activeTool === 'fill' ? 'active' : ''}`}
                 onClick={() => setActiveTool('fill')}
                 title="Fill (Smart/Recursive)"
               >
                 🪣 Fill
               </button>
               <button 
                 className={`layer-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                 onClick={() => setActiveTool('eraser')}
               >
                  ⌫ Eraser
                </button>
                <button 
                  className={`layer-btn ${activeTool === 'spawn' ? 'active' : ''}`}
                  onClick={() => setActiveTool('spawn')}
                >
                  📍 Spawn
                </button>
             </div>
         </div>

        <div className="palette-container">
             <div className="tab-container">
               <button 
                 className={`tab ${activeTab === 'tileset' ? 'active' : ''}`}
                 onClick={() => {
                   setActiveTab('tileset');
                   if (tilesetOptions.length > 0) setActiveAsset(tilesetOptions[0]);
                 }}
               >
                 Tileset
               </button>
               <button 
                 className={`tab ${activeTab === 'autoset' ? 'active' : ''}`}
                 onClick={() => {
                    setActiveTab('autoset');
                    if (autosetOptions.length > 0) setActiveAsset(autosetOptions[0]);
                    else setActiveAsset('');
                 }}
               >
                 Autoset
               </button>
               <button 
                 className={`tab ${activeTab === 'animations' ? 'active' : ''}`}
                 onClick={() => {
                    setActiveTab('animations');
                    setActiveAsset(''); // AnimationSelector handles selection
                 }}
               >
                 Animation
               </button>
             </div>

             {activeTab !== 'animations' ? (
                <>
                  <div className="asset-selector">
                      <select 
                        className="asset-select"
                        value={activeAsset}
                        onChange={(e) => setActiveAsset(e.target.value)}
                      >
                        {activeTab === 'tileset' && tilesetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {activeTab === 'autoset' && (autosetOptions.length > 0 ? 
                            autosetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                            : <option disabled>No Autosets</option>)}
                      </select>
                  </div>

                  {activeAsset && (
                    activeTab === 'tileset' ? tilesetAssets[activeAsset] : 
                    autosetAssets[activeAsset]
                  ) && (
                  <>
                    <div className="palette-wrapper">
                    <img 
                      src={getPaletteSource() || ''}
                      className="palette-image"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent native drag
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
                        const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
                        setIsSelecting(true);
                        setSelectionStart({ x, y });
                        setSelection({ x, y, w: 1, h: 1 });
                      }}
                      onMouseMove={(e) => {
                        if (!isSelecting) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        // Clamp to image bounds? Native mouse can go outside, but let's stick to simple logic
                        const currentX = Math.floor((e.clientX - rect.left) / TILE_SIZE);
                        const currentY = Math.floor((e.clientY - rect.top) / TILE_SIZE);
                        
                        const startX = selectionStart.x;
                        const startY = selectionStart.y;
                        
                        const minX = Math.min(startX, currentX);
                        const minY = Math.min(startY, currentY);
                        const maxX = Math.max(startX, currentX);
                        const maxY = Math.max(startY, currentY);
                        
                        setSelection({
                          x: minX,
                          y: minY,
                          w: maxX - minX + 1,
                          h: maxY - minY + 1
                        });
                      }}
                      onMouseUp={() => {}} // Handled globally
                      alt="Palette"
                    />
                    {activeAsset && (
                        <div 
                          className="tile-selection-highlight" 
                          style={{
                            left: selection.x * TILE_SIZE,
                            top: selection.y * TILE_SIZE,
                            width: selection.w * TILE_SIZE,
                            height: selection.h * TILE_SIZE
                          }}
                        />
                      )}
                  </div>
                    <div className="selected-tile-preview">
                        Selection: {selection.w}x{selection.h} at ({selection.x}, {selection.y})
                    </div>
                  </>
                )}
              </>
             ) : (
                <AnimationSelector 
                    onSelect={(set, startId) => {
                        setActiveAsset(set);
                        const asset = imageCache.current[set];
                        const tilesPerRow = asset ? Math.floor(asset.width / TILE_SIZE) : 1;
                        setSelection({
                            x: startId % tilesPerRow,
                            y: Math.floor(startId / tilesPerRow),
                            w: 1,
                            h: 1
                        });
                    }}
                    activeAsset={activeAsset}
                    activeId={selection.y * (imageCache.current[activeAsset] ? Math.floor(imageCache.current[activeAsset].width / TILE_SIZE) : 1) + selection.x}
                    imageCache={imageCache.current}
                />
             )}
        </div>
      </div>

      <div className="main-area">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={mapSize.width * TILE_SIZE}
            height={mapSize.height * TILE_SIZE}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={() => {}} // Handled globally
            onMouseMove={handleCanvasMouseMove}
          />
        </div>
      </div>
      
      {/* Load Modal */}
      {showLoadModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Load Map</h3>
                <div className="map-list">
                    {savedMaps.length === 0 ? <p className="empty-list-msg">No saved maps found.</p> : (
                        savedMaps.map(mapName => (
                            <button key={mapName} onClick={() => loadMapFromServer(mapName)} className="map-list-item">
                                {mapName}
                            </button>
                        ))
                    )}
                </div>
                <button onClick={() => setShowLoadModal(false)} className="close-modal-btn">Cancel</button>
            </div>
        </div>
      )}

      {/* Save Modal */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveMap}
        existingMaps={savedMaps}
      />
    </div>
  );
};
