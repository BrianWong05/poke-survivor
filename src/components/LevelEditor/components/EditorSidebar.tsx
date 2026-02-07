import React from 'react';
import { AnimationSelector } from '@/components/LevelEditor/AnimationSelector';
import { LayerPanel } from '@/components/LevelEditor/components/LayerPanel';
import type { ToolType, AssetTab, MapSize, SelectionState, LayerData } from '@/components/LevelEditor/types';
import { TILE_SIZE } from '@/components/LevelEditor/constants';

interface SidebarProps {
  // Map State
  mapSize: MapSize;
  onResize: (w: number, h: number) => void;
  activeTool: ToolType;
  onToolChange: (t: ToolType) => void;

  // Layers
  layers: LayerData[];
  currentLayerId: string;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleCollision: (id: string) => void;

  // History & IO
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onPlay: () => void;
  onExit: () => void;

  // Assets
  activeTab: AssetTab;
  onTabChange: (t: AssetTab) => void;
  activeAsset: string;
  onAssetChange: (a: string) => void;
  assetOptions: { tilesets: string[], autosets: string[] };

  // Palette
  paletteImageSource: string | undefined;
  selection: SelectionState;
  onPaletteSelection: (sel: SelectionState) => void;
  imageCache: Record<string, HTMLImageElement | HTMLCanvasElement>;
}

export const EditorSidebar: React.FC<SidebarProps> = (props) => {
  const {
    mapSize, onResize, activeTool, onToolChange,
    layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
    onRenameLayer, onReorderLayer, onToggleVisibility, onToggleCollision,
    canUndo, canRedo, onUndo, onRedo, onSave, onLoad, onPlay, onExit,
    activeTab, onTabChange, activeAsset, onAssetChange, assetOptions,
    paletteImageSource, selection, onPaletteSelection, imageCache
  } = props;

  const handlePaletteMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    onPaletteSelection({ x, y, w: 1, h: 1 });
  };

  return (
    <div className="sidebar">
      <h2>Level Editor</h2>

      {/* Main Controls */}
      <div className="controls-group main-controls">
        <button onClick={onPlay} className="control-btn play-btn">▶ Play</button>
        <button onClick={onExit} className="control-btn exit-btn">✖ Exit</button>
      </div>

      {/* IO Controls */}
      <div className="controls-group io-controls">
        <button onClick={onLoad} className="control-btn load-btn">📂 Load</button>
        <button onClick={onSave} className="control-btn save-btn">💾 Save</button>
      </div>

      {/* History */}
      <div className="controls-group history-controls">
        <button onClick={onUndo} disabled={!canUndo} className="control-btn undo-btn">⎌ Undo</button>
        <button onClick={onRedo} disabled={!canRedo} className="control-btn redo-btn">↻ Redo</button>
      </div>

      {/* Map Settings */}
      <div className="map-settings">
        <div className="settings-row">
          <label>W:</label>
          <input
            type="number"
            className="dim-input"
            value={mapSize.width}
            onChange={(e) => onResize(parseInt(e.target.value) || 10, mapSize.height)}
          />
          <label>H:</label>
          <input
            type="number"
            className="dim-input"
            value={mapSize.height}
            onChange={(e) => onResize(mapSize.width, parseInt(e.target.value) || 10)}
          />
        </div>

        <div className="settings-row" style={{ marginTop: '0.5rem' }}>
           {(['brush', 'fill', 'eraser', 'area-eraser', 'spawn'] as ToolType[]).map(tool => {
             const label = { brush: '🖌 brush', fill: '🪣 fill', eraser: '⌫ eraser', 'area-eraser': '🗑 area erase', spawn: '📍 spawn' }[tool];
             return (
               <button
                 key={tool}
                 className={`layer-btn ${activeTool === tool ? 'active' : ''}`}
                 onClick={() => onToolChange(tool)}
                 title={tool}
               >
                 {label}
               </button>
             );
           })}
         </div>
      </div>

      {/* Layer Panel */}
      <LayerPanel
        layers={layers}
        currentLayerId={currentLayerId}
        onSelectLayer={onSelectLayer}
        onAddLayer={onAddLayer}
        onRemoveLayer={onRemoveLayer}
        onRenameLayer={onRenameLayer}
        onReorderLayer={onReorderLayer}
        onToggleVisibility={onToggleVisibility}
        onToggleCollision={onToggleCollision}
      />

      {/* Palette */}
      <div className="palette-container">
         <div className="tab-container">
           {(['tileset', 'autoset', 'animations'] as AssetTab[]).map(tab => (
             <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onTabChange(tab)}
             >
               {tab}
             </button>
           ))}
         </div>

         {activeTab !== 'animations' ? (
            <>
              <div className="asset-selector">
                <select className="asset-select" value={activeAsset} onChange={(e) => onAssetChange(e.target.value)}>
                   {(activeTab === 'tileset' ? assetOptions.tilesets : assetOptions.autosets).map(opt => (
                     <option key={opt} value={opt}>{opt}</option>
                   ))}
                </select>
              </div>

              {paletteImageSource && (
                <div className="palette-wrapper">
                  <img
                    src={paletteImageSource}
                    className="palette-image"
                    onMouseDown={handlePaletteMouseDown}
                    alt="Palette"
                  />
                  <div
                    className="tile-selection-highlight"
                    style={{
                      left: selection.x * TILE_SIZE,
                      top: selection.y * TILE_SIZE,
                      width: selection.w * TILE_SIZE,
                      height: selection.h * TILE_SIZE
                    }}
                  />
                </div>
              )}
            </>
         ) : (
            <AnimationSelector
               onSelect={(set, startId) => {
                   onAssetChange(set);
                   const asset = imageCache[set];
                   const cols = asset ? Math.floor(asset.width / TILE_SIZE) : 1;
                   onPaletteSelection({ x: startId % cols, y: Math.floor(startId / cols), w: 1, h: 1 });
               }}
               activeAsset={activeAsset}
               activeId={0}
               imageCache={imageCache}
            />
         )}
      </div>
    </div>
  );
};
