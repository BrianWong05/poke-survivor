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
  // Selection State (Tileset Coordinates)
  const [selection, setSelection] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  
  // Map Data State
  const [mapSize, setMapSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  // Initialize with -1 (empty) for objects, and -1 (empty/black) for ground
  const [groundLayer, setGroundLayer] = useState<number[][]>(() => 
    Array(DEFAULT_HEIGHT).fill(0).map(() => Array(DEFAULT_WIDTH).fill(-1))
  );
  const [objectLayer, setObjectLayer] = useState<number[][]>(() => 
    Array(DEFAULT_HEIGHT).fill(0).map(() => Array(DEFAULT_WIDTH).fill(-1))
  );

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

    // Render Highlight if valid mouse pos? (Optional, skipping for simple React implementation)

  }, [groundLayer, objectLayer]);

  const drawTile = (ctx: CanvasRenderingContext2D, tileId: number, x: number, y: number, alpha: number) => {
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
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
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
  };

  // Re-render on state change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Painting Logic
  const handlePaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    
    // const rect = canvas.getBoundingClientRect();
    // const x = e.clientX - rect.left; // Adjust for scroll/offset
    // const y = e.clientY - rect.top; // Adjust for scroll/offset (Note: logic might need simple container offset check)
    // Actually simpler: e.nativeEvent.offsetX/Y gives pos inside element
    const nativeX = e.nativeEvent.offsetX;
    const nativeY = e.nativeEvent.offsetY;

    const tileX = Math.floor(nativeX / TILE_SIZE);
    const tileY = Math.floor(nativeY / TILE_SIZE);

    if (tileX < 0 || tileX >= mapSize.width || tileY < 0 || tileY >= mapSize.height) return;

    if (currentLayer === 0) {
      const newGrid = [...groundLayer];
      // Paint selection block
      for (let dy = 0; dy < selection.h; dy++) {
        for (let dx = 0; dx < selection.w; dx++) {
          const mapY = tileY + dy;
          const mapX = tileX + dx;
          
          if (mapY < mapSize.height && mapX < mapSize.width) {
             const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
             const sourceId = (selection.y + dy) * tilesPerRow + (selection.x + dx);
             
             newGrid[mapY] = [...newGrid[mapY]];
             newGrid[mapY][mapX] = sourceId;
          }
        }
      }
      setGroundLayer(newGrid);
    } else {
      const newGrid = [...objectLayer];
      // Paint selection block
      for (let dy = 0; dy < selection.h; dy++) {
        for (let dx = 0; dx < selection.w; dx++) {
            const mapY = tileY + dy;
            const mapX = tileX + dx;

            if (mapY < mapSize.height && mapX < mapSize.width) {
               const tilesPerRow = tilesetRef.current ? Math.floor(tilesetRef.current.width / TILE_SIZE) : 1;
               const sourceId = (selection.y + dy) * tilesPerRow + (selection.x + dx);

               newGrid[mapY] = [...newGrid[mapY]];
               newGrid[mapY][mapX] = sourceId;
            }
        }
      }
      setObjectLayer(newGrid);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handlePaint(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) handlePaint(e);
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
        
        <div className="controls">
             <button onClick={handleExport} className="play-btn">▶ Play Map</button>
             <button onClick={onExit} className="exit-btn">Exit</button>
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
                  onMouseUp={() => setIsSelecting(false)}
                  onMouseLeave={() => setIsSelecting(false)}
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
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={drawMove}
          />
        </div>
      </div>
    </div>
  );
};
