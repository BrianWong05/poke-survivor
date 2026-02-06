import React, { useState } from 'react';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Save Map</h3>
        <input 
          type="text" 
          placeholder="Map Name" 
          value={mapName} 
          onChange={(e) => setMapName(e.target.value)}
          className="save-input"
        />
        <div className="modal-actions">
           <button onClick={handleSave} className="save-confirm-btn">Save</button>
           <button onClick={onClose} className="close-modal-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};
