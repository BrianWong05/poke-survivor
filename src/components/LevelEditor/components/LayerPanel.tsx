import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, MoveUp, MoveDown, Trash2, Footprints } from 'lucide-react';
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
  onToggleLock: (id: string) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers, currentLayerId, onSelectLayer, onAddLayer, onRemoveLayer,
  onRenameLayer, onReorderLayer, onMoveLayer, onToggleVisibility, onToggleCollision, onToggleLock
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

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (layers.length <= 1) return;
    if (window.confirm(`Are you sure you want to delete layer "${name}"?`)) {
        onRemoveLayer(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0" onDragLeave={() => setDragOverIdx(null)}>
      <div className="flex-1 overflow-y-auto min-h-[80px] flex flex-col gap-1 pr-1 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[...layers].reverse().map((layer) => {
          const idx = layers.indexOf(layer);
          const isActive = layer.id === currentLayerId;
          const isDragging = draggedIdx === idx;
          const isDragOver = dragOverIdx === idx;

          return (
            <div
              key={layer.id}
              className={`
                group flex items-center justify-between px-3 h-9 rounded-lg cursor-pointer border border-transparent transition-all relative
                ${isActive 
                    ? 'bg-[#1e1e1e] border-zinc-700/50' 
                    : 'bg-transparent text-zinc-400 hover:bg-[#1e1e1e]/40'
                }
                ${isDragging ? 'opacity-50 border-dashed border-zinc-500' : ''}
                ${isDragOver ? 'border-t-2 border-t-green-500' : ''}
              `}
              onClick={() => onSelectLayer(layer.id)}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
            >
              {/* Left Side: Eye (Gold) + Name */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`flex items-center justify-center transition-colors ${layer.visible ? 'text-[#d97706]' : 'text-zinc-600'}`}
                >
                  <Eye size={14} />
                </div>

                {editingId === layer.id ? (
                  <input
                    className="flex-1 min-w-0 bg-[#111] text-white px-1 py-0.5 text-xs rounded outline-none border border-green-600"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className={`text-xs truncate select-none ${isActive ? 'text-white font-medium' : 'text-zinc-500'}`}
                    onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(layer); }}
                  >
                    {layer.name}
                  </span>
                )}
              </div>

              {/* Right Side: Icons */}
              <div className="flex items-center gap-2.5">
                <button
                    className={`p-1 rounded hover:bg-white/10 transition-colors ${layer.visible ? 'text-zinc-500' : 'text-zinc-700'}`}
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                <div className="text-zinc-700">
                    <Lock size={14} />
                </div>

                <button
                  className={`w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${layer.collision ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-zinc-700'}`}
                  onClick={(e) => { e.stopPropagation(); onToggleCollision(layer.id); }}
                >
                  <Footprints size={12} />
                </button>

                <button
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${layer.locked ? 'text-zinc-500' : 'text-zinc-700'}`}
                  onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                {/* Delete Button (Always Visible) */}
                <button
                    className={`p-1 rounded hover:bg-white/10 transition-colors text-zinc-700 hover:text-red-500 disabled:opacity-30 disabled:hover:text-zinc-700`}
                    onClick={(e) => handleDelete(e, layer.id, layer.name)}
                    disabled={layers.length <= 1}
                    title="Delete Layer"
                >
                    <Trash2 size={14} />
                </button>

                {/* Hover actions */}
                <div className="hidden group-hover:flex gap-0.5 absolute right-1 bg-[#1e1e1e] px-1 rounded-lg border border-zinc-700 shadow-xl z-10">
                    <button
                        className="p-1 text-zinc-500 hover:text-white rounded disabled:opacity-30"
                        onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'down'); }}
                        disabled={idx === layers.length - 1} 
                    >
                        <MoveUp size={12} />
                    </button>
                    <button
                        className="p-1 text-zinc-500 hover:text-white rounded disabled:opacity-30"
                        onClick={(e) => { e.stopPropagation(); onReorderLayer(layer.id, 'up'); }}
                        disabled={idx === 0}
                    >
                        <MoveDown size={12} />
                    </button>
                    <button
                        className="p-1 text-zinc-600 hover:text-red-500 rounded disabled:opacity-30"
                        onClick={(e) => handleDelete(e, layer.id, layer.name)}
                        disabled={layers.length <= 1}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button 
        className="w-full h-8 bg-transparent border border-[#2d2d2d] text-zinc-500 text-[11px] font-bold rounded-xl hover:border-zinc-400 hover:text-zinc-300 transition-all flex justify-center items-center gap-2 flex-shrink-0"
        onClick={onAddLayer}
      >
        <span>+ ADD LAYER</span>
      </button>
    </div>
  );
};
