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
    <div className="bg-[#2a2a2a] border border-[#444] rounded p-2" onDragLeave={() => setDragOverIdx(null)}>
      <div className="flex justify-between items-center mb-2 font-bold text-[0.85rem] text-[#ccc]">
        <span>Layers</span>
      </div>
      <div className="flex flex-col gap-[2px] max-h-[200px] overflow-y-auto">
        {[...layers].reverse().map((layer) => {
          const idx = layers.indexOf(layer);
          const isActive = layer.id === currentLayerId;
          const isDragging = draggedIdx === idx;
          const isDragOver = dragOverIdx === idx;

          return (
            <div
              key={layer.id}
              className={`flex items-center gap-1 p-1 px-1.5 bg-[#333] border border-transparent rounded cursor-pointer text-[0.8rem] transition-[background,transform,border] duration-150 ${isActive ? 'bg-[#2a4a2a] border-[#4CAF50]' : 'hover:bg-[#3a3a3a]'} ${isDragging ? 'opacity-50 bg-[#444] border-dashed border-[#777]' : ''} ${isDragOver ? 'border-t-2 border-t-[#4CAF50] translate-y-0.5 bg-[#3d3d3d]' : ''}`}
              onClick={() => onSelectLayer(layer.id)}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
            >
              <button
                className={`bg-none border-none cursor-pointer p-0 text-[0.8rem] min-w-[20px] text-center ${layer.visible ? 'text-[#aaa]' : 'text-[#555]'}`}
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible ? '👁' : '—'}
              </button>

              {editingId === layer.id ? (
                <input
                  className="flex-1 bg-[#1a1a1a] border border-[#4CAF50] text-white p-0 px-1 text-[0.8rem] rounded outline-none"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  className="flex-1 text-[#ddd] whitespace-nowrap overflow-hidden text-ellipsis select-none"
                  onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(layer); }}
                >
                  {layer.name}
                </span>
              )}

              <button
                className={`bg-none border cursor-pointer p-0 px-1 text-[0.7rem] font-bold rounded min-w-[18px] text-center ${layer.collision ? 'text-[#ff9800] border-[#ff9800]' : 'text-[#666] border-[#555]'}`}
                onClick={(e) => { e.stopPropagation(); onToggleCollision(layer.id); }}
                title={layer.collision ? 'Collision ON' : 'Collision OFF'}
              >
                {layer.collision ? 'C' : '·'}
              </button>

              <div className="flex flex-col gap-0">
                <button
                  className="bg-none border-none text-[#888] cursor-pointer p-0 text-[0.5rem] leading-none hover:text-white disabled:text-[#444] disabled:cursor-not-allowed"
                  onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'up'); }}
                  disabled={idx === 0}
                  title="Move down (render earlier)"
                >
                  ▼
                </button>
                <button
                  className="bg-none border-none text-[#888] cursor-pointer p-0 text-[0.5rem] leading-none hover:text-white disabled:text-[#444] disabled:cursor-not-allowed"
                  onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'down'); }}
                  disabled={idx === layers.length - 1}
                  title="Move up (render later)"
                >
                  ▲
                </button>
              </div>

              <button
                className="bg-none border-none text-[#666] cursor-pointer p-0 px-0.5 text-[0.75rem] hover:text-[#e74c3c] disabled:text-[#444] disabled:cursor-not-allowed"
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
      <button className="w-full p-1 mt-2 bg-[#333] border border-dashed border-[#555] text-[#aaa] cursor-pointer rounded text-[0.8rem] transition-all duration-150 hover:bg-[#3a3a3a] hover:border-[#4CAF50] hover:text-[#4CAF50]" onClick={onAddLayer}>+ Add Layer</button>
    </div>
  );
};