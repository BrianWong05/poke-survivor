import { useRef, useEffect, useState, useCallback } from 'react';
import type { CustomMapData } from '@/game/types/map';
import './styles.css';

// Constants
const TILE_SIZE = 32;
const MAP_WIDTH_TILES = 50;
const MAP_HEIGHT_TILES = 50;
const CANVAS_WIDTH = MAP_WIDTH_TILES * TILE_SIZE;
const CANVAS_HEIGHT = MAP_HEIGHT_TILES * TILE_SIZE;

interface LevelEditorProps {
  onPlay: (data: CustomMapData) => void;
  onExit: () => void;
}

export const LevelEditor = ({ onPlay, onExit }: LevelEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLayer, setCurrentLayer] = useState<0 | 1>(0); // 0 = Ground, 1 = Objects
  const [selectedTileId, setSelectedTileId] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Map Data State
  // Initialize with -1 (empty) for objects, and 0 (grass) for ground
  const [groundLayer, setGroundLayer] = useState<number[][]>(() => 
    Array(MAP_HEIGHT_TILES).fill(0).map(() => Array(MAP_WIDTH_TILES).fill(0))
  );
  const [objectLayer, setObjectLayer] = useState<number[][]>(() => 
    Array(MAP_HEIGHT_TILES).fill(0).map(() => Array(MAP_WIDTH_TILES).fill(-1))
  );

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

    // Clear
    ctx.fillStyle = '#1a1a1a'; // Dark background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
    
    // Vertical
    for (let x = 0; x <= CANVAS_WIDTH; x += TILE_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
    }
    // Horizontal
    for (let y = 0; y <= CANVAS_HEIGHT; y += TILE_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
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

    if (tileX < 0 || tileX >= MAP_WIDTH_TILES || tileY < 0 || tileY >= MAP_HEIGHT_TILES) return;

    if (currentLayer === 0) {
      const newGrid = [...groundLayer];
      // Clone row to avoid mutation (react state rule)
      newGrid[tileY] = [...newGrid[tileY]];
      newGrid[tileY][tileX] = selectedTileId;
      setGroundLayer(newGrid);
    } else {
      const newGrid = [...objectLayer];
      newGrid[tileY] = [...newGrid[tileY]];
      newGrid[tileY][tileX] = selectedTileId;
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
      width: MAP_WIDTH_TILES,
      height: MAP_HEIGHT_TILES,
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

        <div className="layer-select">
          <label>
            <input 
              type="radio" 
              checked={currentLayer === 0} 
              onChange={() => setCurrentLayer(0)} 
            /> Ground
          </label>
          <label>
            <input 
              type="radio" 
              checked={currentLayer === 1} 
              onChange={() => setCurrentLayer(1)} 
            /> Objects
          </label>
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
                <img 
                  src={`${activeTab === 'tileset' ? '/assets/tilesets/' : '/assets/autotiles/'}${activeAsset}`} 
                  className="palette-image"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const tx = Math.floor(x / TILE_SIZE);
                    const ty = Math.floor(y / TILE_SIZE);
                    const tilesPerRow = Math.floor(e.currentTarget.width / TILE_SIZE);
                    const id = ty * tilesPerRow + tx;
                    setSelectedTileId(id);
                  }}
                  alt="Palette"
                />
                <div className="selected-tile-preview">
                    Selected ID: {selectedTileId}
                </div>
              </>
             )}
        </div>
      </div>

      <div className="main-area">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
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
