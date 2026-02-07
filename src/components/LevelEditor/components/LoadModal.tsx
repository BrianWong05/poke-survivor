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
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]">
      <div className="bg-[#333] p-8 rounded-lg w-[400px] max-w-[90%] color-white border border-[#555] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <h3 className="text-xl font-bold mb-4">Load Map</h3>
        <div className="max-h-[300px] overflow-y-auto my-4 flex flex-col gap-2">
          {maps.length === 0 ? (
            <p className="text-[#888] italic text-center p-4">No saved maps found.</p>
          ) : (
            maps.map(mapName => (
              <button 
                key={mapName} 
                onClick={() => onLoad(mapName)} 
                className="bg-[#444] border border-[#555] p-3 text-white text-left cursor-pointer rounded hover:bg-[#555] hover:border-[#666]"
              >
                {mapName}
              </button>
            ))
          )}
        </div>
        <button onClick={onClose} className="w-full p-2 bg-[#e74c3c] text-white border-none rounded cursor-pointer font-bold">Cancel</button>
      </div>
    </div>
  );
};