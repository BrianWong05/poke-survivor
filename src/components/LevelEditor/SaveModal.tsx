import { useState, useEffect } from 'react';
import './styles.css';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingMaps: string[];
}

export const SaveModal = ({ isOpen, onClose, onSave, existingMaps }: SaveModalProps) => {
  const [mapName, setMapName] = useState('');
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
        setMapName('');
        setShowOverwriteConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedName = mapName.trim();
    if (!trimmedName) return;

    if (existingMaps.includes(trimmedName) && !showOverwriteConfirm) {
      setShowOverwriteConfirm(true);
      return;
    }
    onSave(trimmedName);
  };

  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <h3>Save Map</h3>
               <div className="save-input-group">
                   <input
                       type="text"
                       className="map-name-input"
                       value={mapName}
                       onChange={(e) => {
                           setMapName(e.target.value);
                           setShowOverwriteConfirm(false);
                       }}
                       placeholder="Enter map name..."
                       autoFocus
                   />
               </div>
               
              <div className="map-list">
                  {existingMaps.length === 0 ? <p className="empty-list-msg">No existing maps.</p> : (
                      existingMaps.map(name => (
                          <button
                              key={name}
                              onClick={() => {
                                  setMapName(name);
                                  setShowOverwriteConfirm(false);
                              }}
                              className={`map-list-item ${mapName === name ? 'selected' : ''}`}
                          >
                              {name}
                          </button>
                      ))
                  )}
              </div>
              
              {showOverwriteConfirm && (
                   <div className="overwrite-warning">
                       Warning: "{mapName}" already exists. Click Save again to overwrite.
                   </div>
              )}

              <div className="modal-actions">
                  <button onClick={handleSave} className="control-btn save-btn full-width">
                      {showOverwriteConfirm ? 'Confirm Overwrite' : 'Save Map'}
                  </button>
                  <button onClick={onClose} className="control-btn cancel-btn full-width">
                      Cancel
                  </button>
              </div>
          </div>
      </div>
  );
};
