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
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]">
      <div className="bg-[#333] p-8 rounded-lg w-[400px] max-w-[90%] text-white border border-[#555] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <h3 className="text-xl font-bold mb-4">Save Map</h3>
        <input 
          type="text" 
          placeholder="Map Name" 
          value={mapName} 
          onChange={(e) => setMapName(e.target.value)}
          className="w-full p-3 bg-[#222] border border-[#555] text-white rounded text-lg box-border focus:border-[#9b59b6] outline-none"
        />
        <div className="flex flex-col gap-2 mt-4">
           <button onClick={handleSave} className="w-full p-2 bg-[#9b59b6] text-white border-none rounded cursor-pointer font-bold hover:brightness-110">Save</button>
           <button onClick={onClose} className="w-full p-2 bg-[#555] text-white border-none rounded cursor-pointer font-bold hover:brightness-110">Cancel</button>
        </div>
      </div>
    </div>
  );
};