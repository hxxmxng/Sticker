
import React from 'react';
import { SHAPES } from '../constants';
import { Shape } from '../types';

interface ShapeSelectorProps {
  selectedId: string;
  onSelect: (shape: Shape) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ selectedId, onSelect }) => {
  const categories = Array.from(new Set(SHAPES.map(s => s.category)));

  return (
    <div className="space-y-6 pt-4">
      {categories.map(cat => (
        <div key={cat} className="space-y-3">
          <h3 className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold px-1">{cat}</h3>
          <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
            {SHAPES.filter(s => s.category === cat).map(shape => (
              <button
                key={shape.id}
                onClick={() => onSelect(shape)}
                className={`
                  aspect-square rounded-xl flex items-center justify-center p-2 transition-all duration-200
                  ${selectedId === shape.id 
                    ? 'bg-slate-100 border border-slate-200 shadow-inner' 
                    : 'hover:bg-slate-50 border border-transparent'
                  }
                `}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                  <path 
                    d={shape.path} 
                    fill={selectedId === shape.id ? "#475569" : "#94a3b8"} 
                    className="transition-colors duration-200"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShapeSelector;
