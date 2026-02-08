import React, { useState } from 'react';
import { Eye, Lock, Unlock, Trash2, Footprints, Plus } from 'lucide-react';
import type { LayerData } from '../types';
import styles from './LayerPanel.module.css';

interface LayerPanelProps {
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
}

export const LayerPanel = ({
  layers,
  currentLayerId,
  onSelectLayer,
  onAddLayer,
  onRemoveLayer,
  onRenameLayer,
  onMoveLayer,
  onToggleVisibility,
  onToggleCollision,
  onToggleLock
}: LayerPanelProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRename = (layer: LayerData) => {
    setEditingId(layer.id);
    setEditName(layer.name);
  };

  const commitRename = () => {
    if (editingId && editName.trim()) {
      onRenameLayer(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {/* Render in reverse order so top layers appear at top of list */}
        {[...layers].reverse().map((layer, index) => {
          // Calculate actual index in original array
          const originalIndex = layers.length - 1 - index;
          
          return (
            <div
              key={layer.id}
              className={`${styles.layerItem} ${layer.id === currentLayerId ? styles.layerItemSelected : ''}`}
              onClick={() => onSelectLayer(layer.id)}
              draggable
              onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', originalIndex.toString());
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  const layerId = layers[fromIndex]?.id;
                  if (layerId) {
                      onMoveLayer(layerId, originalIndex);
                  }
              }}
            >
              <div className={styles.leftGroup}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  className={`${styles.iconButton} ${layer.visible ? styles.activeIcon : ''}`}
                  title={layer.visible ? "Hide" : "Show"}
                >
                   {/* Design uses Eye for both states, just color change. Or Eye/EyeOff. 
                       .pen uses 'eye' for both. We'll use Eye for both but color change. */}
                   <Eye size={14} />
                </button>
                
                {editingId === layer.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={handleKeyDown}
                      className={styles.layerNameInput}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span 
                        className={styles.layerName}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(layer);
                        }}
                    >
                        {layer.name}
                    </span>
                )}
              </div>

              <div className={styles.rightGroup}>
                <button
                   className={styles.iconButton}
                   title="Visibility (Secondary)"
                   style={{ opacity: 0.5, cursor: 'default' }}
                >
                   {/* Placeholder to match design visual of right-side eye */}
                   <Eye size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(layer.id);
                  }}
                  className={`${styles.iconButton} ${layer.locked ? '' : ''}`} // Locked state might need specific color? Design uses muted for both.
                  title={layer.locked ? "Unlock" : "Lock"}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollision(layer.id);
                  }}
                  className={`${styles.walkBtn} ${layer.collision ? styles.walkBtnActive : ''}`}
                  title="Toggle Collision"
                >
                  <div style={{ color: layer.collision ? '#fff' : '#ffffff', display:'flex' }}>
                    {/* Design uses 'directions_walk' from Material Symbols. We use 'Footprints' or closest Lucide. */}
                    <Footprints size={12} fill={layer.collision ? "white" : "none"} />
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Delete layer?')) onRemoveLayer(layer.id);
                  }}
                  className={styles.iconButton}
                  title="Delete"
                  disabled={layers.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

       <button 
        className={styles.addLayerBtn}
        onClick={onAddLayer}
      >
        <Plus size={14} className="text-[#a0a0a0]" />
        <span className={styles.addLayerText}>ADD LAYER</span>
      </button>
    </div>
  );
};
