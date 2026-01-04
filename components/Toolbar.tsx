
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
        onFeedback('복사 완료 ✨');
      }
    } catch (err) {
      const link = document.createElement('a');
      link.download = `sticker-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onFeedback('이미지로 저장됨');
    }
  };

  const rotate = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 max-w-full px-4 pt-2">
      {/* Utility Tools */}
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-1.5 py-1 shadow-sm">
        <button 
          onClick={rotate}
          className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
          title="Rotate"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div className="w-px h-4 bg-slate-100 mx-1"></div>
        <button 
          onClick={() => setTransform(p => ({ ...p, scale: 0.8, x: 0, y: 0 }))}
          className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
          title="Center"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Main Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[12px] font-medium hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
        >
          이미지 변경
        </button>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 text-white rounded-2xl text-[12px] font-medium hover:bg-slate-800 transition-all shadow active:scale-95"
        >
          <span>스티커 복사</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
