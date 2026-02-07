import { useState, useCallback } from 'react';
import type { CustomMapData, TileData } from '@/game/types/map';
import { updateAutoTileGrid } from '@/components/LevelEditor/utils';
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
import type { ToolType, AssetTab, SelectionState } from '@/components/LevelEditor/types';

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
    
    // Check if current layer is locked
    const currentLayer = mapState.layers.find(l => l.id === mapState.currentLayerId);
    if (currentLayer?.locked) return;

    // Save history only on the start of a stroke
    if (!isDragging) mapState.saveHistory();

    mapState.setCurrentLayerTiles((prev: TileData[][]) => {
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
    });
  }, [activeTool, activeAsset, activeTab, selection, mapState.mapSize, mapState.currentLayerId, mapState.layers, mapState.saveHistory, mapState.setCurrentLayerTiles, imageCache]);

  const handleDragEnd = useCallback((start: {x:number, y:number}, end: {x:number, y:number}) => {
    // Check if current layer is locked (except for spawn tool which is global/meta)
    const currentLayer = mapState.layers.find(l => l.id === mapState.currentLayerId);
    if (activeTool !== 'spawn' && currentLayer?.locked) return;

    if (activeTool === 'spawn') {
      mapState.setSpawnPoint({ x: start.x, y: start.y });
      return;
    }

    if (activeTool === 'area-eraser') {
      mapState.saveHistory();
      const minX = Math.max(0, Math.min(start.x, end.x));
      const maxX = Math.min(mapState.mapSize.width - 1, Math.max(start.x, end.x));
      const minY = Math.max(0, Math.min(start.y, end.y));
      const maxY = Math.min(mapState.mapSize.height - 1, Math.max(start.y, end.y));

      mapState.setCurrentLayerTiles((prev: TileData[][]) => {
        const newGrid = prev.map(row => [...row]);
        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            newGrid[y][x] = { ...EMPTY_TILE };
          }
        }
        return newGrid;
      });
      return;
    }

    if (activeTool === 'fill') {
      mapState.saveHistory();
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      mapState.setCurrentLayerTiles((prev: TileData[][]) => {
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
      });
    }
  }, [activeTool, activeAsset, activeTab, selection, mapState.currentLayerId, mapState.layers, mapState.setSpawnPoint, mapState.saveHistory, mapState.setCurrentLayerTiles, imageCache]);

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
      mapState.layers,
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
      mapState.loadFromData(data);
      setShowLoadModal(false);
    } else {
      alert('Failed to load map.');
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#111] text-white overflow-hidden font-sans">
      <EditorSidebar
        mapSize={mapState.mapSize}
        onResize={mapState.resizeMap}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        layers={mapState.layers}
        currentLayerId={mapState.currentLayerId}
        onSelectLayer={mapState.setCurrentLayerId}
        onAddLayer={mapState.addLayer}
        onRemoveLayer={mapState.removeLayer}
        onRenameLayer={mapState.renameLayer}
        onReorderLayer={mapState.reorderLayer}
        onMoveLayer={mapState.moveLayer}
        onToggleVisibility={mapState.toggleLayerVisibility}
        onToggleCollision={mapState.toggleLayerCollision}
        onToggleLock={mapState.toggleLayerLock}
        canUndo={mapState.history.length > 0}
        canRedo={mapState.redoStack.length > 0}
        onUndo={mapState.undo}
        onRedo={mapState.redo}
        onSave={onOpenSaveModal}
        onLoad={onOpenLoadModal}
        onPlay={() => onPlay(constructMapData())}
        onExit={onExit}
        activeTab={activeTab}
        onTabChange={(t) => { 
          setActiveTab(t); 
          if(t === 'animations') {
             setActiveAsset('');
          } else {
             const options = t === 'tileset' ? Object.keys(assets.tilesets) : Object.keys(assets.autosets);
             const first = options.sort()[0] || '';
             setActiveAsset(first);
          }
        }}
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
        zoom={mapState.zoom}
        onZoomIn={() => mapState.setZoom(z => z + 0.1)} // Using hardcoded step or export constant
        onZoomOut={() => mapState.setZoom(z => z - 0.1)}
        onZoomReset={() => mapState.setZoom(1.0)}
      />

      <div 
        className="flex-1 overflow-auto relative bg-black grid place-items-center" 
        style={{ padding: '20px' }}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.deltaY < 0) mapState.setZoom(z => z + 0.1);
            else mapState.setZoom(z => z - 0.1);
          }
        }}
      >
          <EditorCanvas
             mapSize={mapState.mapSize}
             layers={mapState.layers}
             currentLayerId={mapState.currentLayerId}
             spawnPoint={mapState.spawnPoint}
             activeTool={activeTool}
             activeAsset={activeAsset}
             activeTab={activeTab}
             selection={selection}
             imageCache={imageCache.current}
             imagesLoaded={imagesLoaded}
             onPaint={handlePaint}
             onDragEnd={handleDragEnd}
             zoom={mapState.zoom}
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