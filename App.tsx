
import React, { useState, useRef } from 'react';
import { SHAPES } from './constants';
import { Shape, Transform, EditorState } from './types';
import CanvasEditor from './components/CanvasEditor';
import ShapeSelector from './components/ShapeSelector';
import Toolbar from './components/Toolbar';

const App: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape>(SHAPES[0]);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [state, setState] = useState<EditorState>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setState('editing');
        setTransform({ x: 0, y: 0, scale: 0.8, rotation: 0 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col md:flex-row-reverse bg-[#f8fafc] select-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Sidebar - Shape Selection (Right side on desktop) */}
      <div className="w-full md:w-80 h-1/3 md:h-full border-b md:border-b-0 md:border-l border-slate-200 bg-white flex flex-col overflow-hidden">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">StickerStudio</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">Organic photo sticker lab</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-12">
          <ShapeSelector 
            selectedId={selectedShape.id} 
            onSelect={setSelectedShape} 
          />
        </div>
      </div>

      {/* Main Workspace (Left side on desktop) */}
      <main className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
        {state === 'idle' ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-64 h-64 border-2 border-dashed border-slate-200 rounded-[40px] flex items-center justify-center bg-white/50 transition-all hover:bg-white hover:border-blue-200 group">
              <div className="flex flex-col items-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-light">사진을 여기에 드래그하세요</span>
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-sm font-medium transition-all shadow-md active:scale-95"
            >
              파일 선택하기
            </button>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <CanvasEditor 
              image={image} 
              shape={selectedShape} 
              transform={transform}
              setTransform={setTransform}
            />
            
            <Toolbar 
              image={image}
              shape={selectedShape}
              transform={transform}
              setTransform={setTransform}
              onReset={() => { setImage(null); setState('idle'); }}
              onFeedback={showFeedback}
            />
          </div>
        )}

        {feedback && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-800 text-white rounded-full text-sm shadow-xl z-50 transition-all animate-in slide-in-from-top-4">
            {feedback}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
