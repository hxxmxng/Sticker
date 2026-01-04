
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col md:flex-row-reverse bg-slate-50 select-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Sidebar - Shape Selection (Narrower for Split View) */}
      <div className="w-full md:w-64 h-[40%] md:h-full border-b md:border-b-0 md:border-l border-slate-200 bg-white flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50">
          <h1 className="text-lg font-semibold text-slate-700 tracking-tight">StickerStudio</h1>
          <p className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Muted Lab</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-8">
          <ShapeSelector 
            selectedId={selectedShape.id} 
            onSelect={setSelectedShape} 
          />
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden">
        {state === 'idle' ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-56 h-56 border border-dashed border-slate-300 rounded-[32px] flex items-center justify-center bg-white/40 cursor-pointer hover:bg-white transition-colors group"
            >
              <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-500 transition-colors">
                <svg className="w-8 h-8 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-light">탭하여 사진 선택</span>
              </div>
            </div>
            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
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
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-800/90 backdrop-blur text-white rounded-full text-[13px] shadow-lg z-50 animate-in slide-in-from-top-2">
            {feedback}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
