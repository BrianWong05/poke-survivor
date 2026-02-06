import React from 'react';

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  maps: string[];
  onLoad: (mapName: string) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, maps, onLoad }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Load Map</h3>
        <div className="map-list">
          {maps.length === 0 ? (
            <p className="empty-list-msg">No saved maps found.</p>
          ) : (
            maps.map(mapName => (
              <button 
                key={mapName} 
                onClick={() => onLoad(mapName)} 
                className="map-list-item"
              >
                {mapName}
              </button>
            ))
          )}
        </div>
        <button onClick={onClose} className="close-modal-btn">Cancel</button>
      </div>
    </div>
  );
};
