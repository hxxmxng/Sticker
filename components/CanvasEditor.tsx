
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

    // High resolution rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw masking shape
    ctx.save();
    const shapePath = new Path2D(shape.path);
    
    // Scale shape path to fit canvas size
    const shapeMatrix = new DOMMatrix().scale(CANVAS_SIZE / 100, CANVAS_SIZE / 100);
    const scaledPath = new Path2D();
    // Path2D doesn't have a direct transform, so we use a matrix with clip
    ctx.translate(0, 0);
    ctx.scale(CANVAS_SIZE/100, CANVAS_SIZE/100);
    ctx.clip(shapePath);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale for image drawing
    ctx.scale(dpr, dpr);

    // Image logic: calculate center point
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
    const pos = 'touches' in e ? e.touches[0] : e;
    dragStartPos.current = { 
      x: pos.clientX - transform.x, 
      y: pos.clientY - transform.y 
    };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const pos = 'touches' in e ? e.touches[0] : e;
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

  // Drag-out support
  const handleDragStart = async (e: React.DragEvent) => {
    if (!canvasRef.current) return;
    const blob = await new Promise<Blob | null>(res => canvasRef.current?.toBlob(res, 'image/png'));
    if (!blob) return;
    
    // Attempt to make the drag experience native if possible
    const url = URL.createObjectURL(blob);
    e.dataTransfer.setData('text/plain', 'Sticker');
    e.dataTransfer.setData('text/html', `<img src="${url}" />`);
    // Note: modern browsers have limited support for File objects in dataTransfer during dragstart
  };

  return (
    <div className="relative group">
      <div 
        className="canvas-checkerboard rounded-[40px] shadow-2xl overflow-hidden cursor-move touch-none border-4 border-white transition-all hover:scale-[1.01]"
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
        <p className="text-[11px] text-[#a1a1a1] bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-[#ece6de]">
          Scroll to zoom • Drag to move • Click shapes to change
        </p>
      </div>
    </div>
  );
};

export default CanvasEditor;
