import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, Lock, Unlock, Trash2, Footprints } from 'lucide-react';
import type { LayerData } from '../types';
import styles from './LayerPanel.module.css';

interface LayerItemProps {
  layer: LayerData;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onToggleCollision: () => void;
  onRemove: () => void;
  onEditNameChange: (name: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onStartRename: () => void;
  style?: React.CSSProperties;
  dragOverlay?: boolean;
  [key: string]: any; // Allow passing through dnd attributes/listeners
}

export const LayerItem = forwardRef<HTMLDivElement, LayerItemProps>(({
  layer,
  isActive,
  isEditing,
  editName,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onToggleCollision,
  onRemove,
  onEditNameChange,
  onCommitRename,
  onCancelRename,
  onStartRename,
  style,
  dragOverlay,
  ...props
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onCommitRename();
    if (e.key === 'Escape') onCancelRename();
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`${styles.layerItem} ${isActive ? styles.layerItemSelected : ''}`}
      onClick={onSelect}
      {...props}
    >
      <div className={styles.leftGroup}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className={`${styles.iconButton} ${layer.visible ? styles.activeIcon : ''}`}
          title={layer.visible ? "Hide" : "Show"}
        >
          <Eye size={14} />
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onBlur={onCommitRename}
            onKeyDown={handleKeyDown}
            className={styles.layerNameInput}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()} 
          />
        ) : (
          <span
            className={styles.layerName}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStartRename();
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
          <Eye size={14} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className={styles.iconButton}
          title={layer.locked ? "Unlock" : "Lock"}
        >
          {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollision();
          }}
          className={`${styles.walkBtn} ${layer.collision ? styles.walkBtnActive : ''}`}
          title="Toggle Collision"
        >
          <div style={{ color: layer.collision ? '#fff' : '#ffffff', display: 'flex' }}>
            <Footprints size={12} fill={layer.collision ? "white" : "none"} />
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={styles.iconButton}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
});

interface SortableLayerItemProps extends Omit<LayerItemProps, 'style' | 'ref'> {}

export const SortableLayerItem = (props: SortableLayerItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <LayerItem
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};
