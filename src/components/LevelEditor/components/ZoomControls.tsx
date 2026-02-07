import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onZoomReset }: ZoomControlsProps) => {
  return (
    <div className="flex items-center justify-between w-full h-[40px] bg-[#1e1e1e] rounded-xl border border-[#2d2d2d] px-3">
      <button
        onClick={onZoomOut}
        className="p-1 hover:text-white text-zinc-400 transition-colors"
        title="Zoom Out (Ctrl -)"
      >
        <ZoomOut size={18} />
      </button>
      
      <button 
        onClick={onZoomReset}
        className="text-[13px] font-semibold text-white hover:text-zinc-300 transition-colors"
        title="Reset Zoom (Ctrl 0)"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        onClick={onZoomIn}
        className="p-1 hover:text-white text-zinc-400 transition-colors"
        title="Zoom In (Ctrl +)"
      >
        <ZoomIn size={18} />
      </button>
    </div>
  );
};