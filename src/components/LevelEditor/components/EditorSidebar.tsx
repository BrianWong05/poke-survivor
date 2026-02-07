import React from 'react';
import {
  Play,
  ChevronDown,
  Paintbrush,
  PaintBucket,
  Eraser,
  Grid3x3,
  MapPin,
  RefreshCw,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  LogOut
} from 'lucide-react';
import { LayerPanel } from './LayerPanel';
import { AnimationSelector } from '../AnimationSelector';
import { ZoomControls } from './ZoomControls';
import type { MapSize, ToolType, LayerData, SelectionState, AssetTab } from '../types';

interface EditorSidebarProps {
  mapSize: MapSize;
  onResize: (w: number, h: number) => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
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
  onToggleLock: (id: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onPlay: () => void;
  onExit: () => void;
  activeTab: AssetTab;
  onTabChange: (tab: AssetTab) => void;
  activeAsset: string;
  onAssetChange: (asset: string) => void;
  assetOptions: { tilesets: string[]; autosets: string[] };
  paletteImageSource?: string;
  selection: SelectionState;
  onPaletteSelection: (sel: SelectionState) => void;
  imageCache: Record<string, HTMLImageElement | HTMLCanvasElement>;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  mapSize, onResize, activeTool, onToolChange,
  layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
  onRenameLayer, onReorderLayer, onMoveLayer, onToggleVisibility, onToggleCollision, onToggleLock,
  onSave, onLoad, onPlay, onExit,
  canUndo, canRedo, onUndo, onRedo,
  activeTab, onTabChange, activeAsset, onAssetChange, assetOptions,
  paletteImageSource, selection, onPaletteSelection, imageCache,
  zoom, onZoomIn, onZoomOut, onZoomReset
}) => {
  return (
    <div 
        className="w-[340px] h-full bg-[#121212] border-r border-[#2d2d2d] flex flex-col select-none overflow-y-auto overflow-x-hidden transition-all [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ padding: '32px 24px', gap: '28px' }}
    >
      
      <div className="flex flex-col gap-5 flex-shrink-0">
        <div className="flex gap-3">
            {/* Play Test Button */}
            <button
                onClick={onPlay}
                className="flex-1 h-12 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-lg"
            >
                <Play size={16} fill="white" />
                <span className="text-base">Play Test</span>
            </button>
            
            {/* Exit Button */}
            <button
                onClick={onExit}
                title="Exit Editor"
                className="w-12 h-12 bg-[#1e1e1e] border border-[#2d2d2d] text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition-colors"
            >
                <LogOut size={20} />
            </button>
        </div>

        <div className="flex justify-between items-center px-1">
            <div className="text-white font-black text-[22px] tracking-widest">
                LEVEL EDITOR
            </div>

            <div className="flex gap-1.5">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 transition-colors"
                >
                    <Undo2 size={18} />
                </button>
                <button 
                    onClick={onRedo} 
                    disabled={!canRedo}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 transition-colors"
                >
                    <Redo2 size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* TOOLS Section */}
      <div 
        className="w-full bg-[#18181b] rounded-2xl flex flex-col shadow-lg"
        style={{ padding: '16px', gap: '14px' }}
      >
        <div className="flex justify-between items-center text-zinc-400 text-[11px] font-bold tracking-wider px-1">
          <span>TOOLS</span>
          <ChevronDown size={14} />
        </div>
        
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
                <ToolButton
                    active={activeTool === 'brush'}
                    onClick={() => onToolChange('brush')}
                    icon={<Paintbrush size={20} />}
                    label="BRUSH"
                />
                <ToolButton
                    active={activeTool === 'fill'}
                    onClick={() => onToolChange('fill')}
                    icon={<PaintBucket size={20} />}
                    label="FILL"
                />
                <ToolButton
                    active={activeTool === 'eraser'}
                    onClick={() => onToolChange('eraser')}
                    icon={<Eraser size={20} />}
                    label="ERASER"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <ToolButton
                    active={activeTool === 'area-eraser'}
                    onClick={() => onToolChange('area-eraser')}
                    icon={<Grid3x3 size={20} />}
                    label="AREA"
                />
                <ToolButton
                    active={activeTool === 'spawn'}
                    onClick={() => onToolChange('spawn')}
                    icon={<MapPin size={20} />}
                    label="SPAWN"
                />
            </div>
        </div>
      </div>

      {/* CONFIGURATION Section */}
      <div 
        className="w-full bg-[#18181b] rounded-2xl flex flex-col shadow-lg"
        style={{ padding: '16px', gap: '14px' }}
      >
        <div className="flex justify-between items-center text-zinc-400 text-[11px] font-bold tracking-wider px-1">
          <span>CONFIGURATION</span>
          <RefreshCw size={14} />
        </div>

        <div className="flex gap-4">
           <div className="flex-1 flex flex-col gap-1.5">
             <span className="text-zinc-500 text-[10px] font-bold px-1">WIDTH</span>
             <div className="h-9 bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl flex items-center px-3">
                <input 
                  type="number" 
                  className="bg-transparent border-none text-white w-full outline-none text-[13px] font-medium"
                  value={mapSize.width}
                  onChange={(e) => onResize(parseInt(e.target.value) || 1, mapSize.height)}
                />
             </div>
           </div>
           <div className="flex-1 flex flex-col gap-1.5">
             <span className="text-zinc-500 text-[10px] font-bold px-1">HEIGHT</span>
             <div className="h-9 bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl flex items-center px-3">
                <input 
                  type="number" 
                  className="bg-transparent border-none text-white w-full outline-none text-[13px] font-medium"
                  value={mapSize.height}
                  onChange={(e) => onResize(mapSize.width, parseInt(e.target.value) || 1)}
                />
             </div>
           </div>
        </div>

        <div className="flex gap-2">
          <button 
             onClick={onLoad}
             className="flex-1 h-10 bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors"
          >
             <FolderOpen size={14} className="text-zinc-400" />
             <span className="text-zinc-300 text-xs font-bold">Load</span>
          </button>
          <button 
             onClick={onSave}
             className="flex-1 h-10 bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
             <Save size={14} className="text-white" fill="white" />
             <span className="text-white text-xs font-bold">Save</span>
          </button>
        </div>
      </div>

      {/* VIEW Section */}
      <div 
        className="w-full bg-[#18181b] rounded-2xl flex flex-col shadow-lg"
        style={{ padding: '16px', gap: '14px' }}
      >
        <div className="flex justify-between items-center text-zinc-400 text-[11px] font-bold tracking-wider px-1">
          <span>VIEW</span>
          <ChevronDown size={14} />
        </div>

        <ZoomControls 
             zoom={zoom}
             onZoomIn={onZoomIn}
             onZoomOut={onZoomOut}
             onZoomReset={onZoomReset}
        />
      </div>

       {/* LAYERS Section */}
       <div 
        className="w-full bg-[#18181b] rounded-2xl flex flex-col min-h-[180px] shadow-lg"
        style={{ padding: '16px', gap: '14px' }}
       >
        <div className="flex justify-between items-center text-zinc-400 text-[11px] font-bold tracking-wider px-1">
          <span>LAYERS</span>
          <ChevronDown size={14} />
        </div>
        
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
            onToggleLock={onToggleLock}
        />
       </div>

       {/* TILESET Section */}
       <div 
        className="w-full bg-[#18181b] rounded-2xl flex flex-col flex-shrink-0 min-h-[420px] shadow-lg"
        style={{ padding: '16px', gap: '14px' }}
       >
          <div className="bg-[#1e1e1e]/50 p-1 rounded-xl">
            <div className="grid grid-cols-3 gap-1">
              <TabButton 
                  active={activeTab === 'tileset'} 
                  onClick={() => onTabChange('tileset')} 
                  label="TILESET" 
              />
              <TabButton 
                  active={activeTab === 'autoset'} 
                  onClick={() => onTabChange('autoset')} 
                  label="AUTOSET" 
              />
              <TabButton 
                  active={activeTab === 'animations'} 
                  onClick={() => onTabChange('animations')} 
                  label="ANIMATIONS" 
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 min-h-0">
             {activeTab === 'animations' ? (
               <div className="flex-1 overflow-y-auto bg-[#1e1e1e] rounded-xl border border-[#2d2d2d]">
                  <AnimationSelector 
                    onSelect={(set, _id) => {
                       onAssetChange(set);
                    }}
                    activeAsset={activeAsset}
                    activeId={0}
                    imageCache={imageCache}
                  />
               </div>
             ) : (
                <>
                  <div className="relative group px-1">
                     <select 
                        className="w-full h-9 bg-transparent text-zinc-300 text-xs outline-none appearance-none border-b border-[#2d2d2d] cursor-pointer font-medium"
                        value={activeAsset}
                        onChange={(e) => onAssetChange(e.target.value)}
                     >
                        {(activeTab === 'tileset' ? assetOptions.tilesets : assetOptions.autosets).map(asset => (
                           <option key={asset} value={asset} className="bg-[#222] text-white">
                              {asset}
                           </option>
                        ))}
                     </select>
                     <ChevronDown size={14} className="absolute right-3 top-2.5 text-zinc-500 pointer-events-none" />
                  </div>

                  <div className="flex-1 overflow-auto bg-[#1e1e1e] rounded-xl border border-[#2d2d2d] relative min-h-0 [image-rendering:pixelated] shadow-inner p-2">
                     {paletteImageSource && (
                        <div 
                           className="relative cursor-crosshair w-fit h-fit"
                           onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = Math.floor((e.clientX - rect.left) / 32); 
                              const y = Math.floor((e.clientY - rect.top) / 32);
                              if (x >= 0 && y >= 0) onPaletteSelection({ x, y, w: 1, h: 1 });
                           }}
                        >
                           <img 
                              src={paletteImageSource} 
                              alt="palette" 
                              className="block"
                              style={{ maxWidth: 'none' }}
                           />
                           <div 
                              className="absolute border-2 border-white pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
                              style={{
                                 left: selection.x * 32,
                                 top: selection.y * 32,
                                 width: selection.w * 32,
                                 height: selection.h * 32
                              }}
                           />
                        </div>
                     )}
                  </div>
                </>
             )}
          </div>
       </div>

    </div>
  );
};

interface ToolButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full h-[60px] rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
            ${active 
                ? 'bg-[#2a2a2a] border-white/10 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]' 
                : 'bg-[#1e1e1e] border-[#2d2d2d] text-zinc-500 hover:bg-[#222] hover:text-zinc-300'
            }`}
    >
        <div className={active ? 'text-white' : 'text-zinc-500'}>{icon}</div>
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
       onClick={onClick}
       className={`h-8 rounded-lg text-[10px] font-bold transition-all px-3
          ${active 
             ? 'bg-[#2d2d2d] text-white shadow-sm' 
             : 'text-zinc-500 hover:text-zinc-400'
          }`}
    >
       {label}
    </button>
);