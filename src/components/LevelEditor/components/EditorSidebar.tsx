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
  onMoveLayer: (id: string, toIndex: number) => void;
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
    onRenameLayer, onReorderLayer, onMoveLayer, onToggleVisibility, onToggleCollision,
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

  const toolClasses = (tool: ToolType) => 
    `flex flex-col items-center justify-center gap-1 p-2 bg-[#333] border border-[#444] text-[#aaa] cursor-pointer rounded-md transition-all duration-200 hover:bg-[#3d3d3d] hover:text-[#eee] ${activeTool === tool ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-[0_0_8px_rgba(76,175,80,0.3)]' : ''}`;

  return (
    <div className="w-[300px] bg-[#222] border-r border-[#444] p-4 flex flex-col gap-4 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.5)] overflow-y-auto max-h-full">
      <h2 className="text-xl font-bold">Level Editor</h2>

      {/* Main Controls */}
      <div className="flex gap-2 mb-2 shrink-0">
        <button onClick={onPlay} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#2ecc71] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px]">▶ Play</button>
        <button onClick={onExit} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#e74c3c] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px]">✖ Exit</button>
      </div>

      {/* IO Controls */}
      <div className="flex gap-2 mb-2 shrink-0">
        <button onClick={onLoad} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#3498db] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px]">📂 Load</button>
        <button onClick={onSave} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#9b59b6] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px]">💾 Save</button>
      </div>

      {/* History */}
      <div className="flex gap-2 mb-2 shrink-0">
        <button onClick={onUndo} disabled={!canUndo} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#f39c12] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.8]">⎌ Undo</button>
        <button onClick={onRedo} disabled={!canRedo} className="flex-1 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-[6px] text-white py-2 px-4 rounded-md bg-[#e67e22] hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.8]">↻ Redo</button>
      </div>

      {/* Map Settings & Tools */}
      <div className="bg-[#2a2a2a] p-3 rounded-lg border border-[#444] flex flex-col gap-3">
        <div className="text-[0.75rem] font-bold text-[#888] uppercase tracking-wider">Map Configuration</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] text-[#aaa]">Width</label>
            <input
              type="number"
              className="w-full p-1.5 bg-[#1a1a1a] border border-[#444] text-white rounded font-size-[0.85rem] transition-colors duration-200 focus:border-[#4CAF50] outline-none"
              value={mapSize.width}
              onChange={(e) => onResize(parseInt(e.target.value) || 10, mapSize.height)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.7rem] text-[#aaa]">Height</label>
            <input
              type="number"
              className="w-full p-1.5 bg-[#1a1a1a] border border-[#444] text-white rounded font-size-[0.85rem] transition-colors duration-200 focus:border-[#4CAF50] outline-none"
              value={mapSize.height}
              onChange={(e) => onResize(mapSize.width, parseInt(e.target.value) || 10)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
           {(['brush', 'fill', 'eraser', 'area-eraser', 'spawn'] as ToolType[]).map(tool => {
             const { icon, label } = {
               brush: { icon: '🖌️', label: 'Brush' },
               fill: { icon: '🪣', label: 'Fill' },
               eraser: { icon: '⌫', label: 'Eraser' },
               'area-eraser': { icon: '🗑️', label: 'Area' },
               spawn: { icon: '📍', label: 'Spawn' }
             }[tool];

             return (
               <button
                 key={tool}
                 className={toolClasses(tool)}
                 onClick={() => onToolChange(tool)}
                 title={label}
               >
                 <span className="text-[1.1rem]">{icon}</span>
                 <span className="text-[0.65rem] font-semibold">{label}</span>
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
        onMoveLayer={onMoveLayer}
        onToggleVisibility={onToggleVisibility}
        onToggleCollision={onToggleCollision}
      />

      {/* Palette */}
      <div className="flex-1 flex flex-col border border-[#444] p-2 bg-[#1a1a1a] min-h-[250px] overflow-hidden">
         <div className="flex mb-2 border-b border-[#444] shrink-0">
           {(['tileset', 'autoset', 'animations'] as AssetTab[]).map(tab => (
             <button
                key={tab}
                className={`flex-1 p-2 bg-[#2a2a2a] border-none text-[#888] cursor-pointer rounded-t-md font-bold ${activeTab === tab ? 'bg-[#444] text-white border-b-2 border-b-[#4CAF50]' : ''}`}
                onClick={() => onTabChange(tab)}
             >
               {tab}
             </button>
           ))}
         </div>

         {activeTab !== 'animations' && (
            <div className="mb-2 shrink-0">
              <select className="w-full p-2 bg-[#333] text-white border border-[#555] rounded-md" value={activeAsset} onChange={(e) => onAssetChange(e.target.value)}>
                 {(activeTab === 'tileset' ? assetOptions.tilesets : assetOptions.autosets).map(opt => (
                   <option key={opt} value={opt}>{opt}</option>
                 ))}
              </select>
            </div>
         )}

         <div className="flex-1 overflow-auto">
           {activeTab !== 'animations' ? (
              paletteImageSource && (
                <div className="relative inline-block">
                  <img
                    src={paletteImageSource}
                    className="cursor-crosshair border border-[#555] block [image-rendering:pixelated]"
                    onMouseDown={handlePaletteMouseDown}
                    alt="Palette"
                  />
                  <div
                    className="absolute border-2 border-red-600 box-border pointer-events-none bg-red-600/20 z-10"
                    style={{
                      left: selection.x * TILE_SIZE,
                      top: selection.y * TILE_SIZE,
                      width: selection.w * TILE_SIZE,
                      height: selection.h * TILE_SIZE
                    }}
                  />
                </div>
              )
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
    </div>
  );
};