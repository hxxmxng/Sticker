
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
    <div className="space-y-8">
      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#a1a1a1] font-semibold px-2">{cat}</h3>
          <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
            {SHAPES.filter(s => s.category === cat).map(shape => (
              <button
                key={shape.id}
                onClick={() => onSelect(shape)}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center p-3 transition-all duration-300
                  ${selectedId === shape.id 
                    ? 'bg-[#f5f0e9] border border-[#dcd4cb] scale-105 shadow-sm' 
                    : 'hover:bg-[#faf9f6] border border-transparent'
                  }
                `}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path 
                    d={shape.path} 
                    fill={selectedId === shape.id ? "#5c5c5c" : "#dcd4cb"} 
                    className="transition-colors duration-300"
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
