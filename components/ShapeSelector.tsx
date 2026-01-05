
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
    <div className="space-y-10 pt-2">
      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-extrabold">{cat}</h3>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-2 gap-3.5">
            {SHAPES.filter(s => s.category === cat).map(shape => (
              <button
                key={shape.id}
                onClick={() => onSelect(shape)}
                className={`
                  relative aspect-square rounded-[22px] flex items-center justify-center p-3.5 transition-all duration-300 group
                  ${selectedId === shape.id 
                    ? 'bg-slate-900 shadow-xl shadow-slate-200 ring-2 ring-slate-900 ring-offset-2 scale-100' 
                    : 'bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md active:scale-95'
                  }
                `}
              >
                <div className="w-full h-full flex items-center justify-center overflow-visible">
                  <svg 
                    // Using a padded viewBox (-15 to 115 instead of 0 to 100) ensures shapes never touch the edge of the button
                    viewBox="-15 -15 130 130" 
                    className="w-full h-full drop-shadow-sm overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path 
                      d={shape.path} 
                      fill={selectedId === shape.id ? "#ffffff" : "#94a3b8"} 
                      className={`transition-colors duration-300 ${selectedId !== shape.id ? 'group-hover:fill-slate-600' : ''}`}
                    />
                  </svg>
                </div>
                {selectedId === shape.id && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShapeSelector;
