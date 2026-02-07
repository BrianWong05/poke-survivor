import React, { useState } from 'react';
import type { LayerData } from '@/components/LevelEditor/types';

interface LayerPanelProps {
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
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
  onRenameLayer, onReorderLayer, onMoveLayer, onToggleVisibility, onToggleCollision
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDoubleClick = (layer: LayerData) => {
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

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (targetIdx: number) => {
    if (draggedIdx !== null && draggedIdx !== targetIdx) {
      const draggedLayer = layers[draggedIdx];
      onMoveLayer(draggedLayer.id, targetIdx);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="layer-panel" onDragLeave={() => setDragOverIdx(null)}>
      <div className="layer-panel-header">
        <span>Layers</span>
      </div>
      <div className="layer-list">
        {[...layers].reverse().map((layer) => {
          const idx = layers.indexOf(layer);
          const isActive = layer.id === currentLayerId;
          const isDragging = draggedIdx === idx;
          const isDragOver = dragOverIdx === idx;

          return (
            <div
              key={layer.id}
              className={`layer-row ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
              onClick={() => onSelectLayer(layer.id)}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
            >
              <button
                className={`layer-visibility-btn ${layer.visible ? '' : 'hidden-layer'}`}
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible ? '👁' : '—'}
              </button>

              {editingId === layer.id ? (
                <input
                  className="layer-name-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  className="layer-name"
                  onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(layer); }}
                >
                  {layer.name}
                </span>
              )}

              <button
                className={`layer-collision-btn ${layer.collision ? 'collision-on' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleCollision(layer.id); }}
                title={layer.collision ? 'Collision ON' : 'Collision OFF'}
              >
                {layer.collision ? 'C' : '·'}
              </button>

              <div className="layer-reorder-btns">
                <button
                  className="layer-reorder-btn"
                  onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'up'); }}
                  disabled={idx === 0}
                  title="Move down (render earlier)"
                >
                  ▼
                </button>
                <button
                  className="layer-reorder-btn"
                  onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'down'); }}
                  disabled={idx === layers.length - 1}
                  title="Move up (render later)"
                >
                  ▲
                </button>
              </div>

              <button
                className="layer-delete-btn"
                onClick={(e) => { e.stopPropagation(); onRemoveLayer(layer.id); }}
                disabled={layers.length <= 1}
                title="Delete layer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <button className="layer-add-btn" onClick={onAddLayer}>+ Add Layer</button>
    </div>
  );
};
