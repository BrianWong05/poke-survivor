import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { LayerData } from '../types';
import styles from './LayerPanel.module.css';
import { SortableLayerItem, LayerItem } from './SortableLayerItem';

interface LayerPanelProps {
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // We render the list in reverse order, so we need to calculate
      // the indices based on the reversed list that dnd-kit sees.
      const visualLayers = [...layers].reverse();
      const newVisualIndex = visualLayers.findIndex((l) => l.id === over.id);

      // Convert visual index back to actual index in the layers array
      // actual index = (length - 1) - visual index
      const newActualIndex = layers.length - 1 - newVisualIndex;
      
      onMoveLayer(active.id as string, newActualIndex);
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeLayer = layers.find((l) => l.id === activeId);
  // Create reversed copy for rendering to match display order (top layer first)
  const visualLayers = [...layers].reverse();

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.list}>
          <SortableContext
            items={visualLayers.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {visualLayers.map((layer) => (
              <SortableLayerItem
                key={layer.id}
                layer={layer}
                isActive={layer.id === currentLayerId}
                isEditing={editingId === layer.id}
                editName={editingId === layer.id ? editName : ''}
                onSelect={() => onSelectLayer(layer.id === currentLayerId ? null : layer.id)}
                onToggleVisibility={() => onToggleVisibility(layer.id)}
                onToggleLock={() => onToggleLock(layer.id)}
                onToggleCollision={() => onToggleCollision(layer.id)}
                onRemove={() => onRemoveLayer(layer.id)}
                onEditNameChange={setEditName}
                onCommitRename={commitRename}
                onCancelRename={() => setEditingId(null)}
                onStartRename={() => handleStartRename(layer)}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeLayer ? (
            <LayerItem
              layer={activeLayer}
              isActive={activeLayer.id === currentLayerId}
              isEditing={false} // Don't show edit input while dragging
              editName=""
              onSelect={() => {}}
              onToggleVisibility={() => {}}
              onToggleLock={() => {}}
              onToggleCollision={() => {}}
              onRemove={() => {}}
              onEditNameChange={() => {}}
              onCommitRename={() => {}}
              onCancelRename={() => {}}
              onStartRename={() => {}}
              dragOverlay
              style={{ cursor: 'grabbing' }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

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
