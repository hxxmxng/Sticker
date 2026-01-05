
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
        onFeedback('STICKER COPIED ✨');
      }
    } catch (err) {
      const link = document.createElement('a');
      link.download = `sticker-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onFeedback('SAVED AS IMAGE 📸');
    }
  };

  const rotate = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const resetAdjustments = () => {
    setTransform({ x: 0, y: 0, scale: 1.0, rotation: 0 });
    onFeedback('RESET ADJUSTMENTS');
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 animate-in slide-in-from-bottom-8 duration-700">
      {/* Photo Controls */}
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
        <button 
          onClick={rotate}
          className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
          title="Rotate Photo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div className="w-[1px] h-6 bg-slate-100 mx-1.5"></div>
        <button 
          onClick={resetAdjustments}
          className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
          title="Center Photo"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Main Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onReset}
          className="px-6 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[11px] font-extrabold tracking-[0.2em] uppercase hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
        >
          New Photo
        </button>
        
        <button 
          onClick={copyToClipboard}
          className="group flex items-center gap-3.5 px-10 py-4 bg-slate-900 text-white rounded-[24px] text-[11px] font-extrabold tracking-[0.25em] uppercase hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          <span>Done & Copy</span>
          <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
