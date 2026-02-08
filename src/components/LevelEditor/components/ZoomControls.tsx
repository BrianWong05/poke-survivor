import { Minus, Plus } from 'lucide-react';
import styles from './ZoomControls.module.css';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
  return (
    <div className={styles.container}>
      <button 
        onClick={onZoomOut}
        className={styles.button}
        title="Zoom Out"
      >
        <Minus size={14} />
      </button>
      
      <span 
        className={styles.label}
        onClick={onReset}
        title="Reset Zoom"
      >
        {Math.round(zoom * 100)}%
      </span>
      
      <button 
        onClick={onZoomIn}
        className={styles.button}
        title="Zoom In"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};