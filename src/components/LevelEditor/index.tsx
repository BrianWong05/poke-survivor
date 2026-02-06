import { useState, useCallback } from 'react';
import type { CustomMapData, TileData } from '@/game/types/map';
import { updateAutoTileGrid } from '@/components/LevelEditor/utils'; // Keep existing utility for now
import { compressMapData } from '@/components/LevelEditor/utils/mapCompression';

// Components
import { SaveModal } from '@/components/LevelEditor/components/SaveModal';
import { LoadModal } from '@/components/LevelEditor/components/LoadModal';
import { EditorSidebar } from '@/components/LevelEditor/components/EditorSidebar';
import { EditorCanvas } from '@/components/LevelEditor/components/EditorCanvas';

// Hooks
import { useMapState } from '@/components/LevelEditor/hooks/useMapState';
import { useAssetLibrary } from '@/components/LevelEditor/hooks/useAssetLibrary';
import { useMapPersistence } from '@/components/LevelEditor/hooks/useMapPersistence';

// Constants & Types
import { TILE_SIZE, EMPTY_TILE } from '@/components/LevelEditor/constants';
import type { ToolType, LayerType, AssetTab, SelectionState } from '@/components/LevelEditor/types';
import './styles.css';

interface LevelEditorProps {
  onPlay: (data: CustomMapData) => void;
  onExit: () => void;
  initialData?: CustomMapData;
}

export const LevelEditor = ({ onPlay, onExit, initialData }: LevelEditorProps) => {
  // State Hooks
  const mapState = useMapState(initialData);
  const { assets, imageCache, imagesLoaded } = useAssetLibrary();
  const persistence = useMapPersistence();

  // Local UI State
  const [currentLayer, setCurrentLayer] = useState<LayerType>(0);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [activeTab, setActiveTab] = useState<AssetTab>('tileset');
  const [activeAsset, setActiveAsset] = useState<string>('Outside.png');
  const [selection, setSelection] = useState<SelectionState>({ x: 0, y: 0, w: 1, h: 1 });
  
  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // --- Handlers ---

  const handlePaint = useCallback((x: number, y: number, isDragging: boolean) => {
    if (x < 0 || x >= mapState.mapSize.width || y < 0 || y >= mapState.mapSize.height) return;
    
    // Save history only on the start of a stroke
    if (!isDragging) mapState.saveHistory();

    const updateLayer = (prev: TileData[][]) => {
      let newGrid = prev.map(row => [...row]);
      
      if (activeTool === 'eraser') {
        newGrid[y][x] = { ...EMPTY_TILE };
      } else if (activeTool === 'brush') {
         const asset = imageCache.current[activeAsset];
         const tilesPerRow = asset ? Math.floor(asset.width / TILE_SIZE) : 1;
         
         for(let dy=0; dy < selection.h; dy++) {
           for(let dx=0; dx < selection.w; dx++) {
             const tx = x + dx; 
             const ty = y + dy;
             if(tx < mapState.mapSize.width && ty < mapState.mapSize.height) {
                const sourceId = (selection.y + dy) * tilesPerRow + (selection.x + dx);
                newGrid[ty][tx] = { id: sourceId, set: activeAsset, type: activeTab };
                
                if (activeTab === 'autoset') {
                  newGrid = updateAutoTileGrid(newGrid, tx, ty, activeAsset);
                }
             }
           }
         }
      }
      return newGrid;
    };

    if (currentLayer === 0) mapState.setGroundLayer(updateLayer);
    else mapState.setObjectLayer(updateLayer);
  }, [activeTool, activeAsset, activeTab, selection, currentLayer, mapState, imageCache]);

  const handleDragEnd = useCallback((start: {x:number, y:number}, end: {x:number, y:number}) => {
    if (activeTool === 'spawn') {
      mapState.setSpawnPoint({ x: start.x, y: start.y });
      return;
    }
    
    if (activeTool === 'fill') {
      mapState.saveHistory();
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      const updateLayer = (prev: TileData[][]) => {
        let newGrid = prev.map(row => [...row]);
        const asset = imageCache.current[activeAsset];
        const tilesPerRow = asset ? Math.floor(asset.width / TILE_SIZE) : 1;

        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
             const patternX = (x - minX) % selection.w;
             const patternY = (y - minY) % selection.h;
             const sourceId = (selection.y + patternY) * tilesPerRow + (selection.x + patternX);
             newGrid[y][x] = { id: sourceId, set: activeAsset, type: activeTab };
          }
        }
        
        // Post-fill autoset update
        if (activeTab === 'autoset') {
           for (let y = minY; y <= maxY; y++) {
             for (let x = minX; x <= maxX; x++) {
                newGrid = updateAutoTileGrid(newGrid, x, y, activeAsset);
             }
           }
        }
        return newGrid;
      };

      if (currentLayer === 0) mapState.setGroundLayer(updateLayer);
      else mapState.setObjectLayer(updateLayer);
    }
  }, [activeTool, activeAsset, activeTab, selection, currentLayer, mapState, imageCache]);

  const getPaletteSource = () => {
     if (!activeAsset || !imagesLoaded) return undefined;
     if (activeTab === 'autoset') return assets.autosets[activeAsset] as string;
     
     const cached = imageCache.current[activeAsset];
     if (cached instanceof HTMLCanvasElement) return cached.toDataURL();
     if (cached instanceof HTMLImageElement) return cached.src;
     return undefined;
  };

  const constructMapData = useCallback(() => {
    return compressMapData(
      mapState.mapSize,
      TILE_SIZE,
      mapState.groundLayer,
      mapState.objectLayer,
      mapState.spawnPoint
    );
  }, [mapState]);

  // --- Persistence Actions ---

  const onOpenSaveModal = async () => {
    await persistence.fetchMaps();
    setShowSaveModal(true);
  };

  const onOpenLoadModal = async () => {
    await persistence.fetchMaps();
    setShowLoadModal(true);
  };

  const handleSave = async (name: string) => {
    if (!name) return;
    const data = constructMapData();
    const success = await persistence.saveMap(name, data);
    if (success) {
      alert(`Map "${name}" saved!`);
      setShowSaveModal(false);
    } else {
      alert('Failed to save map.');
    }
  };

  const handleLoad = async (name: string) => {
    const data = await persistence.loadMap(name);
    if (data) {
      mapState.saveHistory(); 
      mapState.loadFromData(data); // Uses the hydration method from Step 9
      setShowLoadModal(false);
    } else {
      alert('Failed to load map.');
    }
  };

  return (
    <div className="level-editor-container">
      <EditorSidebar 
        mapSize={mapState.mapSize}
        onResize={mapState.resizeMap}
        currentLayer={currentLayer}
        onLayerChange={setCurrentLayer}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        canUndo={mapState.history.length > 0}
        canRedo={mapState.redoStack.length > 0}
        onUndo={mapState.undo}
        onRedo={mapState.redo}
        onSave={onOpenSaveModal}
        onLoad={onOpenLoadModal}
        onPlay={() => onPlay(constructMapData())}
        onExit={onExit}
        activeTab={activeTab}
        onTabChange={(t) => { setActiveTab(t); if(t !== 'animations') setActiveAsset(''); }}
        activeAsset={activeAsset}
        onAssetChange={setActiveAsset}
        assetOptions={{
            tilesets: Object.keys(assets.tilesets).sort(),
            autosets: Object.keys(assets.autosets).sort()
        }}
        paletteImageSource={getPaletteSource()}
        selection={selection}
        onPaletteSelection={setSelection}
        imageCache={imageCache.current}
      />

      <div className="main-area">
        <EditorCanvas
           mapSize={mapState.mapSize}
           groundLayer={mapState.groundLayer}
           objectLayer={mapState.objectLayer}
           spawnPoint={mapState.spawnPoint}
           activeTool={activeTool}
           activeAsset={activeAsset}
           activeTab={activeTab}
           selection={selection}
           imageCache={imageCache.current}
           onPaint={handlePaint}
           onDragEnd={handleDragEnd}
        />
      </div>

      <LoadModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        maps={persistence.savedMaps}
        onLoad={handleLoad}
      />

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        existingMaps={persistence.savedMaps}
      />
    </div>
  );
};