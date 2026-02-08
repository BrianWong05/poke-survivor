import React from 'react';
import styles from './Modal.module.css';

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  maps: string[];
  onLoad: (mapName: string) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, maps, onLoad }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Load Map</h3>
        <div className={styles.list}>
          {maps.length === 0 ? (
            <p className={styles.emptyMessage}>No saved maps found.</p>
          ) : (
            maps.map(mapName => (
              <button 
                key={mapName} 
                onClick={() => onLoad(mapName)} 
                className={styles.listItem}
              >
                {mapName}
              </button>
            ))
          )}
        </div>
        <button onClick={onClose} className={styles.dangerButton}>Cancel</button>
      </div>
    </div>
  );
};