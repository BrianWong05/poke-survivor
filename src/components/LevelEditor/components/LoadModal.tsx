import React, { useState } from 'react';
import styles from './Modal.module.css';

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  maps: string[];
  onLoad: (mapName: string) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, maps, onLoad }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const filteredMaps = maps.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Load Map</h3>
        
        <input 
          type="text" 
          placeholder="Search maps..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
          style={{ marginBottom: '1rem' }}
        />

        <div className={styles.list}>
          {filteredMaps.length === 0 ? (
            <p className={styles.emptyMessage}>
              {maps.length === 0 ? 'No saved maps found.' : 'No matches found.'}
            </p>
          ) : (
            filteredMaps.map(mapName => (
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