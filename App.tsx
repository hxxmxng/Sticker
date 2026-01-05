
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
        // Start with a clean scale that fits well in the preview
        setTransform({ x: 0, y: 0, scale: 1.0, rotation: 0 });
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
    setTimeout(() => setFeedback(null), 2400);
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col md:flex-row-reverse bg-[#f8fafc] select-none overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Sidebar - Refined Design */}
      <aside className="w-full md:w-72 h-[35%] md:h-full border-b md:border-b-0 md:border-l border-slate-200 bg-white flex flex-col shadow-[inset_1px_0_0_rgba(0,0,0,0.02)] z-10">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-sm"></div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">StickerStudio</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em]">Est. 2025 • Creative Lab</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-12">
          <ShapeSelector 
            selectedId={selectedShape.id} 
            onSelect={setSelectedShape} 
          />
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-visible bg-[#fbfcfd]">
        {state === 'idle' ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group w-64 h-64 border-2 border-dashed border-slate-200 rounded-[56px] flex flex-col items-center justify-center bg-white cursor-pointer hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 active:scale-[0.97]"
          >
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-300">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-slate-400 tracking-widest group-hover:text-slate-800 transition-colors uppercase">Upload Image</span>
            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <div className="flex-1 flex items-center justify-center w-full overflow-visible">
              <CanvasEditor 
                image={image} 
                shape={selectedShape} 
                transform={transform}
                setTransform={setTransform}
              />
            </div>
            
            <div className="w-full max-w-2xl py-10 flex justify-center z-20">
              <Toolbar 
                image={image}
                shape={selectedShape}
                transform={transform}
                setTransform={setTransform}
                onReset={() => { setImage(null); setState('idle'); }}
                onFeedback={showFeedback}
              />
            </div>
          </div>
        )}

        {/* Feedback Toast */}
        {feedback && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-[13px] font-semibold shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            {feedback}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
