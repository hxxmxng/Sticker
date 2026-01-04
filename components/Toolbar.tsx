
import React from 'react';
import { Transform, Shape } from '../types';

interface ToolbarProps {
  image: HTMLImageElement | null;
  shape: Shape;
  transform: Transform;
  setTransform: React.Dispatch<React.SetStateAction<Transform>>;
  onReset: () => void;
  onFeedback: (msg: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  image, 
  shape, 
  transform, 
  setTransform, 
  onReset,
  onFeedback 
}) => {

  const copyToClipboard = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        onFeedback('Copied to clipboard!');
      }
    } catch (err) {
      console.error('Clipboard error:', err);
      // Fallback: download
      const link = document.createElement('a');
      link.download = `sticker-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onFeedback('Downloaded! (Clipboard failed)');
    }
  };

  const adjustScale = (delta: number) => {
    setTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale + delta) }));
  };

  const rotate = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 animate-in slide-in-from-bottom-4 duration-700">
      {/* Zoom Controls */}
      <div className="flex items-center bg-white border border-[#ece6de] rounded-full px-2 py-1 shadow-sm">
        <button 
          onClick={() => adjustScale(-0.1)}
          className="p-2 text-[#5c5c5c] hover:bg-[#f5f0e9] rounded-full transition-colors"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        <span className="px-3 text-xs font-medium text-[#a1a1a1] w-12 text-center">
          {Math.round(transform.scale * 100)}%
        </span>
        <button 
          onClick={() => adjustScale(0.1)}
          className="p-2 text-[#5c5c5c] hover:bg-[#f5f0e9] rounded-full transition-colors"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Transform Tools */}
      <div className="flex items-center bg-white border border-[#ece6de] rounded-full px-2 py-1 shadow-sm">
        <button 
          onClick={rotate}
          className="p-2 text-[#5c5c5c] hover:bg-[#f5f0e9] rounded-full transition-colors"
          title="Rotate 90°"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-white border border-[#ece6de] text-[#a1a1a1] rounded-full text-sm font-medium hover:text-[#5c5c5c] hover:border-[#dcd4cb] transition-all shadow-sm"
        >
          New Image
        </button>
        <button 
          onClick={copyToClipboard}
          className="group flex items-center gap-2 px-8 py-3 bg-[#5c5c5c] text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <span>Copy Sticker</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
