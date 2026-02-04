import { useRef, useEffect, useState, useCallback } from 'react';
import type { CustomMapData } from '@/game/types/map';
import './styles.css';

// Constants
const TILE_SIZE = 32;
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;

interface LevelEditorProps {
  onPlay: (data: CustomMapData) => void;
  onExit: () => void;
}

export const LevelEditor = ({ onPlay, onExit }: LevelEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLayer, setCurrentLayer] = useState<0 | 1>(0); // 0 = Ground, 1 = Objects
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('brush');
  // Selection State (Tileset Coordinates)
  const [selection, setSelection] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });


  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState({ x: 0, y: 0 });
  const [mapDragCurrent, setMapDragCurrent] = useState({ x: 0, y: 0 });
  

  
  // Map Data State
  const [mapSize, setMapSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  // Initialize with -1 (empty) for objects, and -1 (empty/black) for ground
  const [groundLayer, setGroundLayer] = useState<number[][]>(() => 
    Array(DEFAULT_HEIGHT).fill(0).map(() => Array(DEFAULT_WIDTH).fill(-1))
  );
  const [objectLayer, setObjectLayer] = useState<number[][]>(() => 
    Array(DEFAULT_HEIGHT).fill(0).map(() => Array(DEFAULT_WIDTH).fill(-1))
  );

  // Undo History & Logic
  const [history, setHistory] = useState<Array<{ground: number[][], objects: number[][]}>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ground: number[][], objects: number[][]}>>([]);

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
          return -1; // Default empty/black
        })
      );
      return newGrid;
    });

    // Resize Object Layer
    setObjectLayer(prev => {
      const newGrid = Array(h).fill(0).map((_, y) => 
        Array(w).fill(0).map((_, x) => {
          if (y < prev.length && x < prev[0].length) return prev[y][x];
          return -1; // Default empty
        })
      );
      return newGrid;
    });
  };




  // Tab & Asset State
  const [activeTab, setActiveTab] = useState<'tileset' | 'autoset'>('tileset');
  const [activeAsset, setActiveAsset] = useState<string>('Outside.png');


  // Available Assets (Mock/Scanned)
  const tilesetOptions = [
    "Bike shop interior.png", "Boat.png", "Caves.png", "Department store interior.png",
    "Dungeon cave.png", "Dungeon forest.png", "Factory interior.png", "Game Corner interior.png",
    "Graveyard tower interior.png", "Gyms interior.png", "Harbour interior.png", "Interior general.png",
    "Mansion interior.png", "Mart interior.png", "Multiplayer rooms.png", "Museum interior.png",
    "Outside.png", "Poke Centre interior.png", "Ruins interior.png", "Trainer Tower interior.png",
    "Underground path.png", "Underwater.png"
  ];
  
  const autosetOptions = [
    "Black.png", "Blue cave floor.png", "Blue cave mud.png", "Brick path.png", "Brown cave floor.png",
    "Brown cave sand.png", "Dirt cave highlight.png", "Dirt.png", "Flowers1.png", "Flowers2.png",
    "Fountain1.png", "Fountain2.png", "Gravel.png", "Green cave floor.png", "Light grass.png",
    "Red cave floor.png", "Red cave highlight.png", "Sand shore.png", "Sand.png", "Sea deep.png",
    "Sea without shore.png", "Sea.png", "Seaweed dark.png", "Seaweed light.png", "Snow cave floor.png",
    "Snow cave highlight.png", "Snow cave ice border.png", "Still water.png", "Underwater dark.png",
    "Water current east.png", "Water current north.png", "Water current south.png",
    "Water current west.png", "Water rock.png", "Waterfall bottom.png", "Waterfall crest.png",
    "Waterfall.png", "White cave floor.png", "White cave highlight.png", "White path.png"
  ]; 

  // Load Tileset Image
  const tilesetRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Determine path based on selection
    if (!activeAsset) return;
    
    // Determine folder based on active tab
    const basePath = activeTab === 'tileset' ? '/assets/tilesets/' : '/assets/autotiles/';
    const fullPath = `${basePath}${activeAsset}`;
    
    const img = new Image();
    img.src = fullPath;
    img.onload = () => {
      tilesetRef.current = img;
      renderCanvas(); // Initial render once image loads
    };
  }, [activeAsset]);

  // Render Canvas
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tileId: number, x: number, y: number, alpha: number) => {
    if (!tilesetRef.current) return;
    const tilesPerRow = Math.floor(tilesetRef.current.width / TILE_SIZE);
    
    const srcX = (tileId % tilesPerRow) * TILE_SIZE;
    const srcY = Math.floor(tileId / tilesPerRow) * TILE_SIZE;
    
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      tilesetRef.current,
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
      row.forEach((tileId, x) => {
        if (tileId >= 0) drawTile(ctx, tileId, x, y, 1.0);
      });
    });

    // Render Objects
    objectLayer.forEach((row, y) => {
      row.forEach((tileId, x) => {
        if (tileId >= 0) drawTile(ctx, tileId, x, y, 1.0);
      });
    });

    // Render Grid
    drawGrid(ctx);

    // Draw Drag-to-Fill Preview
    if (isMapDragging) {
       const minX = Math.min(mapDragStart.x, mapDragCurrent.x);
       const minY = Math.min(mapDragStart.y, mapDragCurrent.y);
       const maxX = Math.max(mapDragStart.x, mapDragCurrent.x);
       const maxY = Math.max(mapDragStart.y, mapDragCurrent.y);
       
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
                     
                     drawTile(ctx, sourceId, targetX, targetY, 0.5); // 0.5 alpha for ghost effect
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
  }, [renderCanvas]);

  // Painting Logic

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMapDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    setMapDragStart({ x, y });
    setMapDragCurrent({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (isMapDragging) {
        setMapDragCurrent({ x, y });
    }
  };

  const handleCanvasMouseUp = () => {
    if (isMapDragging) {
        setIsMapDragging(false);
        
        // Save history before mutation
        saveHistory();

        const minX = Math.min(mapDragStart.x, mapDragCurrent.x);
        const minY = Math.min(mapDragStart.y, mapDragCurrent.y);
        const maxX = Math.max(mapDragStart.x, mapDragCurrent.x);
        const maxY = Math.max(mapDragStart.y, mapDragCurrent.y);

        const w = maxX - minX + 1;
        const h = maxY - minY + 1;

        if (currentLayer === 0) {
            setGroundLayer(prev => {
                const newGrid = prev.map(row => [...row]);
                for (let dy = 0; dy < h; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        const targetX = minX + dx;
                        const targetY = minY + dy;
                        if (targetY < mapSize.height && targetX < mapSize.width) {
                             if (activeTool === 'eraser') {
                                 newGrid[targetY][targetX] = -1;
                             } else {
                                 // Pattern Logic
                                 const patternX = dx % selection.w;
                                 const patternY = dy % selection.h;
                                 
                                 const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
                                 const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
                                 newGrid[targetY][targetX] = sourceId;
                             }
                        }
                    }
                }
                return newGrid;
            });
        } else {
             setObjectLayer(prev => {
                const newGrid = prev.map(row => [...row]);
                for (let dy = 0; dy < h; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        const targetX = minX + dx;
                        const targetY = minY + dy;
                        if (targetY < mapSize.height && targetX < mapSize.width) {
                             if (activeTool === 'eraser') {
                                 newGrid[targetY][targetX] = -1;
                             } else {
                                 // Pattern Logic
                                 const patternX = dx % selection.w;
                                 const patternY = dy % selection.h;
                                 
                                 const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
                                 const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
                                 newGrid[targetY][targetX] = sourceId;
                             }
                        }
                    }
                }
                return newGrid;
            });
        }
    }
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
  // Save & Load Map Logic
  const handleSaveMap = () => {
    const data: CustomMapData = {
      width: mapSize.width,
      height: mapSize.height,
      tileSize: TILE_SIZE,
      ground: groundLayer,
      objects: objectLayer
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-map-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = event.target?.result as string;
            const data = JSON.parse(json) as CustomMapData;
            
            // Basic Validation
            if (data.width && data.height && data.ground && data.objects) {
                // Save current state to history before loading
                saveHistory();

                setMapSize({ width: data.width, height: data.height });
                setGroundLayer(data.ground);
                setObjectLayer(data.objects);
                
                // Clear input value so same file can be loaded again if needed
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                alert("Invalid map file format.");
            }
        } catch (err) {
            console.error("Failed to load map:", err);
            alert("Failed to parse map file.");
        }
    };
    reader.readAsText(file);
  };
  const handleExport = () => {
    const data: CustomMapData = {
      width: mapSize.width,
      height: mapSize.height,
      tileSize: TILE_SIZE,
      ground: groundLayer,
      objects: objectLayer
    };
    onPlay(data);
  };

  return (
    <div className="level-editor-container">
      <div className="sidebar">
        <h2>Level Editor</h2>
        
        <div className="controls-group main-controls">
             <button onClick={handleExport} className="control-btn play-btn" title="Play Map">▶ Play</button>
             <button onClick={onExit} className="control-btn exit-btn" title="Exit Editor">✖ Exit</button>
        </div>
        
        <div className="controls-group io-controls">
             <button onClick={() => fileInputRef.current?.click()} className="control-btn load-btn" title="Load Map">📂 Load</button>
             <button onClick={handleSaveMap} className="control-btn save-btn" title="Save Map">💾 Save</button>
        </div>

        <div className="controls-group history-controls">
             <button onClick={undo} className="control-btn undo-btn" disabled={history.length === 0} title="Undo (Cmd+Z)">⎌ Undo</button>
             <button onClick={redo} className="control-btn redo-btn" disabled={redoStack.length === 0} title="Redo (Cmd+Shift+Z)">↻ Redo</button>
        </div>

        {/* Hidden File Input */}
        <input 
           type="file" 
           ref={fileInputRef} 
           style={{ display: 'none' }} 
           accept=".json"
           onChange={handleLoadMap}
        />

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
               >
                 🖌 Brush
               </button>
               <button 
                 className={`layer-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                 onClick={() => setActiveTool('eraser')}
               >
                 ⌫ Eraser
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
             </div>

             <div className="asset-selector">
                <select 
                  className="asset-select"
                  value={activeAsset}
                  onChange={(e) => setActiveAsset(e.target.value)}
                >
                  {activeTab === 'tileset' ? (
                    tilesetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                  ) : (
                    autosetOptions.length > 0 ? 
                      autosetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                      : <option disabled>No Autosets</option>
                  )}
                </select>
             </div>

             {activeAsset && (
              <>
               <div className="palette-wrapper">
                <img 
                  src={`${activeTab === 'tileset' ? '/assets/tilesets/' : '/assets/autotiles/'}${activeAsset}`} 
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
    </div>
  );
};
