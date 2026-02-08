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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Save Map</h3>
        <input 
          type="text" 
          placeholder="Map Name" 
          value={mapName} 
          onChange={(e) => setMapName(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttonGroup}>
           <button onClick={handleSave} className={styles.saveButton}>Save</button>
           <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};