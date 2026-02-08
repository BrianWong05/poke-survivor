import React, { useState } from 'react';
import styles from './Modal.module.css';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingMaps: string[];
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave, existingMaps }) => {
  const [mapName, setMapName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!mapName.trim()) {
      alert('Please enter a map name.');
      return;
    }
    if (existingMaps.includes(mapName)) {
      if (!confirm(`Map "${mapName}" already exists. Overwrite?`)) return;
    }
    onSave(mapName);
    setMapName('');
  };

  const filteredMaps = existingMaps.filter(name => 
    name.toLowerCase().includes(mapName.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Save Map</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search or Enter Map Name" 
            value={mapName} 
            onChange={(e) => setMapName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.list}>
          {filteredMaps.length === 0 ? (
            <div className={styles.emptyMessage}>
              {existingMaps.length === 0 ? 'No saved maps' : 'No matches found'}
            </div>
          ) : (
            filteredMaps.map((name) => (
              <button
                type="button"
                key={name}
                className={styles.listItem}
                onClick={() => setMapName(name)} // Set name on click to streamline overwriting
              >
                {name}
              </button>
            ))
          )}
        </div>
        <div className={styles.buttonGroup}>
           <button onClick={handleSave} className={styles.saveButton}>Save</button>
           <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};