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
  Undo2,
  Redo2,
  LogOut
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
  currentLayerId: string;
  onSelectLayer: (id: string) => void;
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
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  mapSize, onResize, activeTool, onToolChange,
  layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
  onRenameLayer, onMoveLayer, onToggleVisibility, onToggleCollision, onToggleLock,
  onSave, onLoad, onPlay, onExit,
  canUndo, canRedo, onUndo, onRedo,
  activeTab, onTabChange, activeAsset, onAssetChange, assetOptions,
  paletteImageSource, selection, onPaletteSelection, imageCache,
  zoom, onZoomIn, onZoomOut, onZoomReset
}) => {
  return (
    <div className={styles.sidebar}>
      
      <div className={styles.header}>
        <div className={styles.titleRow}>
             <button
                 onClick={onPlay}
                 className={styles.playButtonHeader} // Need to add this or use generic button
                 title="Play Test"
             >
                 <Play size={16} fill="white" />
                 <span>Test</span>
             </button>
            
            <button
                onClick={onExit}
                title="Exit Editor"
                className={styles.backButton}
            >
                <LogOut size={20} />
            </button>
        </div>

        <div className={styles.titleRow}>
            <div className={styles.title}>
                LEVEL EDITOR
            </div>

            <div className={styles.undoRedoGroup}>
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo}
                    className={styles.undoRedoButton}
                >
                    <Undo2 size={18} />
                </button>
                <button 
                    onClick={onRedo} 
                    disabled={!canRedo}
                    className={styles.undoRedoButton}
                >
                    <Redo2 size={18} />
                </button>
            </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* TOOLS Section */}
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
              TOOLS
            </div>
            
            <div className={styles.toolsGrid}>
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

        {/* CONFIGURATION Section */}
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
              CONFIGURATION
            </div>

            <div className={styles.mapSettings}>
               <div className={styles.settingGroup}>
                 <span className={styles.label}>WIDTH</span>
                 <input 
                   type="number" 
                   className={styles.input}
                   value={mapSize.width}
                   onChange={(e) => onResize(parseInt(e.target.value) || 1, mapSize.height)}
                 />
               </div>
               <div className={styles.settingGroup}>
                 <span className={styles.label}>HEIGHT</span>
                 <input 
                   type="number" 
                   className={styles.input}
                   value={mapSize.height}
                   onChange={(e) => onResize(mapSize.width, parseInt(e.target.value) || 1)}
                 />
               </div>
            </div>

            <div className={styles.headerActions}>
              <button 
                 onClick={onLoad}
                 className={`${styles.actionButton} ${styles.loadButton}`}
              >
                 <FolderOpen size={14} />
                 <span>Load</span>
              </button>
              <button 
                 onClick={onSave}
                 className={`${styles.actionButton} ${styles.saveButton}`}
              >
                 <Save size={14} />
                 <span>Save</span>
              </button>
            </div>
        </div>

        {/* VIEW Section */}
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
              VIEW
            </div>
            <ZoomControls 
                 zoom={zoom}
                 onZoomIn={onZoomIn}
                 onZoomOut={onZoomOut}
                 onReset={onZoomReset}
            />
        </div>

        {/* LAYERS Section */}
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
              LAYERS
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
        <div className={styles.section}>
            <div className={styles.tabs}>
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
                  label="ANIM" 
              />
            </div>

            {activeTab === 'animations' ? (
               <div className={styles.paletteContainer}>
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
                   <div className={styles.settingGroup}>
                      <select 
                         className={styles.assetSelect}
                         value={activeAsset}
                         onChange={(e) => onAssetChange(e.target.value)}
                      >
                         {(activeTab === 'tileset' ? assetOptions.tilesets : assetOptions.autosets).map(asset => (
                            <option key={asset} value={asset} style={{backgroundColor: '#222', color: 'white'}}>
                               {asset}
                            </option>
                         ))}
                      </select>
                   </div>

                   <div className={styles.paletteContainer}>
                      {paletteImageSource && (
                         <div 
                            style={{ position: 'relative', cursor: 'crosshair', width: 'fit-content', height: 'fit-content' }}
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
                               className={styles.paletteImage}
                            />
                            <div 
                                style={{
                                   position: 'absolute',
                                   border: '2px solid white',
                                   pointerEvents: 'none',
                                   boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
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
        className={`${styles.toolButton} ${active ? styles.toolButtonActive : ''}`}
    >
        <div>{icon}</div>
        <span style={{fontSize: '10px', fontWeight: 'bold'}}>{label}</span>
    </button>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
       onClick={onClick}
       className={`${styles.tab} ${active ? styles.tabActive : ''}`}
    >
       {label}
    </button>
);