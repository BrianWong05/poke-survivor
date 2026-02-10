import React from 'react';
import {
  Play,
  Paintbrush,
  PaintBucket,
  Eraser,
  Grid3x3,
  MapPin,
  FolderOpen,
  Save,
  RefreshCw,
  ChevronDown,
  ArrowLeft,
  Undo,
  Redo
} from 'lucide-react';
import { LayerPanel } from './LayerPanel';
import { AnimationSelector } from '../AnimationSelector';
import { ZoomControls } from './ZoomControls';
import type { MapSize, ToolType, LayerData, SelectionState, AssetTab } from '../types';
import styles from './EditorSidebar.module.css';

interface EditorSidebarProps {
  mapSize: MapSize;
  onResize: (w: number, h: number) => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  layers: LayerData[];
  currentLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
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
  onToolDoubleClick: (tool: ToolType) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  mapSize, onResize, activeTool, onToolChange,
  layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
  onRenameLayer, onMoveLayer, onToggleVisibility, onToggleCollision, onToggleLock,
  canUndo, canRedo, onUndo, onRedo,
  onSave, onLoad, onPlay, onExit,
  activeTab, onTabChange, activeAsset, onAssetChange, assetOptions,
  paletteImageSource, selection, onPaletteSelection, imageCache,
  zoom, onZoomIn, onZoomOut, onZoomReset, onToolDoubleClick
}) => {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [selectionStart, setSelectionStart] = React.useState<{x: number, y: number} | null>(null);

  return (
    <div className={styles.sidebar}>
      
      {/* Back Button */}
      <button className={styles.backButton} onClick={onExit}>
        <ArrowLeft size={14} color="#a0a0a0" />
        <span className={styles.backText}>Back to Home</span>
      </button>

      {/* Play Test Button */}
      <button className={styles.playButton} onClick={onPlay}>
        <Play size={16} fill="white" />
        <span className={styles.playText}>Play Test</span>
      </button>

      {/* Title */}
      <h1 className={styles.title}>LEVEL EDITOR</h1>

      {/* Undo/Redo */}
      <div className={styles.editActions}>
        <button 
          className={styles.editBtn} 
          onClick={onUndo} 
          disabled={!canUndo}
        >
          <Undo size={14} color="white" />
          <span className={styles.editText}>Undo</span>
        </button>
        <button 
          className={styles.editBtn} 
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo size={14} color="white" />
          <span className={styles.editText}>Redo</span>
        </button>
      </div>

      {/* TOOLS Section */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelLabel}>TOOLS</span>
          <ChevronDown size={14} className="text-[#a0a0a0]" />
        </div>
        
        <div className={styles.toolsGrid}>
          {/* Row 1: Brush, Fill, Eraser */}
          <div className={styles.toolsRow3}>
            <ToolCard
              active={activeTool === 'brush'}
              onClick={() => onToolChange('brush')}
              onDoubleClick={() => onToolDoubleClick('brush')}
              icon={<Paintbrush size={20} />}
              label="BRUSH"
            />
            <ToolCard
              active={activeTool === 'fill'}
              onClick={() => onToolChange('fill')}
              onDoubleClick={() => onToolDoubleClick('fill')}
              icon={<PaintBucket size={20} />}
              label="FILL"
            />
            <ToolCard
              active={activeTool === 'eraser'}
              onClick={() => onToolChange('eraser')}
              onDoubleClick={() => onToolDoubleClick('eraser')}
              icon={<Eraser size={20} />}
              label="ERASER"
            />
          </div>
          {/* Row 2: Area, Spawn */}
          <div className={styles.toolsRow2}>
            <ToolCard
              active={activeTool === 'area-eraser'}
              onClick={() => onToolChange('area-eraser')}
              onDoubleClick={() => onToolDoubleClick('area-eraser')}
              icon={<Grid3x3 size={20} />}
              label="AREA"
            />
            <ToolCard
              active={activeTool === 'spawn'}
              onClick={() => onToolChange('spawn')}
              onDoubleClick={() => onToolDoubleClick('spawn')}
              icon={<MapPin size={20} />}
              label="SPAWN"
            />
          </div>
        </div>
      </div>

      {/* CONFIGURATION Section */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelLabel}>CONFIGURATION</span>
          <RefreshCw size={14} className="text-[#a0a0a0]" />
        </div>

        <div className={styles.configRow}>
          <div className={styles.configCol}>
            <label className={styles.configLabel}>Width</label>
            <div className={styles.configInputWrapper}>
              <input 
                type="number" 
                className={styles.configInput}
                value={mapSize.width}
                onChange={(e) => onResize(parseInt(e.target.value) || 1, mapSize.height)}
              />
            </div>
          </div>
          <div className={styles.configCol}>
            <label className={styles.configLabel}>Height</label>
            <div className={styles.configInputWrapper}>
              <input 
                type="number" 
                className={styles.configInput}
                value={mapSize.height}
                onChange={(e) => onResize(mapSize.width, parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={`${styles.actionBtn} ${styles.loadBtn}`} onClick={onLoad}>
            <FolderOpen size={14} />
            <span>Load</span>
          </button>
          <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={onSave}>
            <Save size={14} fill="white" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* VIEW Section */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelLabel}>VIEW</span>
        </div>
        <ZoomControls 
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onZoomReset}
        />
      </div>

      {/* LAYERS Section */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelLabel}>LAYERS</span>
          <ChevronDown size={14} className="text-[#a0a0a0]" />
        </div>
        <LayerPanel
          layers={layers}
          currentLayerId={currentLayerId}
          onSelectLayer={onSelectLayer}
          onAddLayer={onAddLayer}
          onRemoveLayer={onRemoveLayer}
          onRenameLayer={onRenameLayer}
          onMoveLayer={onMoveLayer}
          onToggleVisibility={onToggleVisibility}
          onToggleCollision={onToggleCollision}
          onToggleLock={onToggleLock}
        />
      </div>

      {/* TILESET Section */}
      <div className={styles.panel}>
        <div className={styles.tilesetTabs}>
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

        {activeTab === 'animations' ? (
           <div className={styles.tilesetGrid}>
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
               <div className={styles.tilesetDropdown}>
                  <select 
                     className={styles.selectInput}
                     value={activeAsset}
                     onChange={(e) => onAssetChange(e.target.value)}
                  >
                     {(activeTab === 'tileset' ? assetOptions.tilesets : assetOptions.autosets).map(asset => (
                        <option key={asset} value={asset} style={{backgroundColor: '#222', color: 'white'}}>
                           {asset}
                        </option>
                     ))}
                  </select>
                  <ChevronDown size={14} className="text-[#a0a0a0] pointer-events-none" style={{position: 'absolute', right: 24}} /> 
                  {/* Note: positioning chevron might need adjustment or parent relative */}
               </div>

               <div className={styles.tilesetGrid}>
                  {paletteImageSource && (
                     <div 
                        style={{ position: 'relative', cursor: 'crosshair', width: 'fit-content', height: 'fit-content' }}
                        onMouseDown={(e) => {
                           // Prevent default to avoid image dragging ghost
                           e.preventDefault();
                           const rect = e.currentTarget.getBoundingClientRect();
                           const x = Math.floor((e.clientX - rect.left) / 32); 
                           const y = Math.floor((e.clientY - rect.top) / 32);
                           if (x >= 0 && y >= 0) {
                              setIsSelecting(true);
                              setSelectionStart({ x, y });
                              // Immediate feedback for 1x1 selection start
                              onPaletteSelection({ x, y, w: 1, h: 1 });
                           }
                        }}
                        onMouseMove={(e) => {
                           if (!isSelecting || !selectionStart) return;
                           const rect = e.currentTarget.getBoundingClientRect();
                           const currentX = Math.floor((e.clientX - rect.left) / 32); 
                           const currentY = Math.floor((e.clientY - rect.top) / 32);
                           
                           if (currentX >= 0 && currentY >= 0) {
                              // Calculate normalized rectangle
                              const x = Math.min(selectionStart.x, currentX);
                              const y = Math.min(selectionStart.y, currentY);
                              const w = Math.abs(currentX - selectionStart.x) + 1;
                              const h = Math.abs(currentY - selectionStart.y) + 1;
                              
                              onPaletteSelection({ x, y, w, h });
                           }
                        }}
                        onMouseUp={() => {
                           setIsSelecting(false);
                           setSelectionStart(null);
                        }}
                        onMouseLeave={() => {
                           if (isSelecting) {
                              setIsSelecting(false);
                              setSelectionStart(null);
                           }
                        }}
                     >
                        <img 
                           src={paletteImageSource} 
                           alt="palette" 
                           style={{ display: 'block', imageRendering: 'pixelated' }}
                           draggable={false}
                        />
                        <div 
                            className={styles.selectionBox}
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
  );
};

interface ToolCardProps {
    active: boolean;
    onClick: () => void;
    onDoubleClick?: () => void;
    icon: React.ReactNode;
    label: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ active, onClick, onDoubleClick, icon, label }) => (
    <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={`${styles.toolCard} ${active ? styles.toolCardActive : ''}`}
    >
        <div style={{ color: active ? '#3b82f6' : '#ffffff' }}>{icon}</div>
        <span className={styles.toolLabel} style={{ color: active ? '#3b82f6' : '#ffffff' }}>{label}</span>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
       onClick={onClick}
       className={`${styles.tab} ${active ? styles.tabActive : ''}`}
    >
       {label}
    </button>
);