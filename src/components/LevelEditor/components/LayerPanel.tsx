import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Footprints, Plus } from 'lucide-react';
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
      <div className={styles.header}>
        <h3 className={styles.title}>Layers</h3>
      </div>

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
            >
              <div 
                className={styles.dragHandle}
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
                <GripVertical size={14} />
              </div>

              <div className={styles.layerInfo}>
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

              <div className={styles.actions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(layer.id);
                  }}
                  className={`${styles.actionButton} ${layer.locked ? styles.locked : ''}`}
                  title={layer.locked ? "Unlock Layer" : "Lock Layer"}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  className={`${styles.actionButton} ${!layer.visible ? styles.actionButtonActive : ''}`}
                  title={layer.visible ? "Hide Layer" : "Show Layer"}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollision(layer.id);
                  }}
                  className={`${styles.actionButton} ${layer.collision ? styles.collisionButtonActive : ''}`}
                  title={layer.collision ? "Disable Collision" : "Enable Collision"}
                >
                  <Footprints size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Delete layer?')) onRemoveLayer(layer.id);
                  }}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Delete Layer"
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
        className={styles.addLayerButtonBottom}
        onClick={onAddLayer}
      >
        <Plus size={14} />
        <span>ADD LAYER</span>
      </button>
    </div>
  );
};
