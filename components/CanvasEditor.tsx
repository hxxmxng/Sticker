
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Shape, Transform } from '../types';

interface CanvasEditorProps {
  image: HTMLImageElement | null;
  shape: Shape;
  transform: Transform;
  setTransform: React.Dispatch<React.SetStateAction<Transform>>;
}

const CANVAS_SIZE = 500;

const CanvasEditor: React.FC<CanvasEditorProps> = ({ image, shape, transform, setTransform }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    const shapePath = new Path2D(shape.path);
    
    ctx.translate(0, 0);
    ctx.scale(CANVAS_SIZE/100, CANVAS_SIZE/100);
    ctx.clip(shapePath);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const imgWidth = image.width;
    const imgHeight = image.height;
    const baseScale = Math.min(CANVAS_SIZE / imgWidth, CANVAS_SIZE / imgHeight);
    
    const finalScale = baseScale * transform.scale;
    const drawX = CANVAS_SIZE / 2 + transform.x;
    const drawY = CANVAS_SIZE / 2 + transform.y;

    ctx.translate(drawX, drawY);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.drawImage(
      image,
      - (imgWidth * finalScale) / 2,
      - (imgHeight * finalScale) / 2,
      imgWidth * finalScale,
      imgHeight * finalScale
    );

    ctx.restore();
  }, [image, shape, transform]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    dragStartPos.current = { 
      x: pos.clientX - transform.x, 
      y: pos.clientY - transform.y 
    };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const pos = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    setTransform(prev => ({
      ...prev,
      x: pos.clientX - dragStartPos.current.x,
      y: pos.clientY - dragStartPos.current.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.001;
    const newScale = Math.max(0.1, Math.min(10, transform.scale - e.deltaY * zoomIntensity));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleDragStart = async (e: React.DragEvent) => {
    if (!canvasRef.current) return;
    const blob = await new Promise<Blob | null>(res => canvasRef.current?.toBlob(res, 'image/png'));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    e.dataTransfer.setData('text/plain', 'Sticker');
    e.dataTransfer.setData('text/html', `<img src="${url}" />`);
  };

  return (
    <div className="relative group">
      <div 
        className="canvas-checkerboard rounded-[40px] shadow-2xl overflow-hidden cursor-move touch-none border-4 border-white ring-1 ring-slate-200 transition-all hover:scale-[1.01]"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        draggable
        onDragStart={handleDragStart}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />
      </div>
      
      <div className="absolute -top-12 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[11px] text-slate-500 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          스크롤하여 확대/축소 • 드래그하여 이동 • 클릭하여 모양 변경
        </p>
      </div>
    </div>
  );
};

export default CanvasEditor;
