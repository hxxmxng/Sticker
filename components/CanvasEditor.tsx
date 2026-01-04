
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Shape, Transform } from '../types';

interface CanvasEditorProps {
  image: HTMLImageElement | null;
  shape: Shape;
  transform: Transform;
  setTransform: React.Dispatch<React.SetStateAction<Transform>>;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ image, shape, transform, setTransform }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialTouchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  // 반응형 캔버스 크기 계산
  const [canvasSize, setCanvasSize] = useState(450);

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.85, window.innerHeight * 0.5, 450);
      setCanvasSize(size);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.save();
    const shapePath = new Path2D(shape.path);
    
    ctx.scale(canvasSize/100, canvasSize/100);
    ctx.clip(shapePath);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const imgWidth = image.width;
    const imgHeight = image.height;
    const baseScale = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
    
    const finalScale = baseScale * transform.scale;
    const drawX = canvasSize / 2 + transform.x;
    const drawY = canvasSize / 2 + transform.y;

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
  }, [image, shape, transform, canvasSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartPos.current = { 
        x: e.touches[0].clientX - transform.x, 
        y: e.touches[0].clientY - transform.y 
      };
    } else if (e.touches.length === 2) {
      initialTouchDistance.current = getDistance(e.touches);
      initialScale.current = transform.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - dragStartPos.current.x,
        y: e.touches[0].clientY - dragStartPos.current.y
      }));
    } else if (e.touches.length === 2 && initialTouchDistance.current) {
      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialTouchDistance.current;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(10, initialScale.current * ratio))
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistance.current = null;
  };

  // Mouse fallback
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { 
      x: e.clientX - transform.x, 
      y: e.clientY - transform.y 
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    }));
  };

  return (
    <div className="relative group">
      <div 
        className="canvas-checkerboard rounded-[32px] shadow-xl overflow-hidden cursor-move touch-none border-2 border-white ring-1 ring-slate-200 transition-all active:scale-[0.99]"
        style={{ width: canvasSize, height: canvasSize }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ width: canvasSize, height: canvasSize }}
        />
      </div>
      
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-slate-500 font-medium tracking-tight">
          Pinch to Zoom • Drag to Move
        </p>
      </div>
    </div>
  );
};

export default CanvasEditor;
