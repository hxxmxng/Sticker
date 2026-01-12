
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
  const [canvasSize, setCanvasSize] = useState(450);
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialTouchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);
  const initialTransform = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.85, window.innerHeight * 0.5, 500);
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

    const dpr = window.devicePixelRatio || 2;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    const frameSize = canvasSize * 0.8;
    const shapeScale = frameSize / 100;

    const buffer = document.createElement('canvas');
    buffer.width = canvasSize * dpr;
    buffer.height = canvasSize * dpr;
    const bctx = buffer.getContext('2d');
    if (!bctx) return;
    bctx.scale(dpr, dpr);

    // [Step 1] 마스크 그리기 (중앙 고정)
    bctx.save();
    bctx.translate(canvasSize / 2, canvasSize / 2);
    bctx.scale(shapeScale, shapeScale);
    bctx.translate(-50, -50);
    const shapePath = new Path2D(shape.path);
    bctx.fillStyle = 'black';
    bctx.fill(shapePath);
    bctx.restore();

    // [Step 2] 사진 그리기 (사용자 변형 적용)
    bctx.globalCompositeOperation = 'source-in';
    bctx.save();
    
    bctx.translate(canvasSize / 2 + transform.x, canvasSize / 2 + transform.y);
    bctx.rotate((transform.rotation * Math.PI) / 180);
    
    const imgWidth = image.width;
    const imgHeight = image.height;
    
    const baseScale = frameSize / Math.min(imgWidth, imgHeight);
    const finalScale = baseScale * transform.scale;
    
    bctx.drawImage(
      image,
      - (imgWidth * finalScale) / 2,
      - (imgHeight * finalScale) / 2,
      imgWidth * finalScale,
      imgHeight * finalScale
    );
    bctx.restore();

    ctx.drawImage(buffer, 0, 0, canvasSize, canvasSize);

    // 가이드 라인
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(shapeScale, shapeScale);
    ctx.translate(-50, -50);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5 / shapeScale;
    ctx.setLineDash([5, 5]);
    ctx.stroke(shapePath);
    ctx.restore();

  }, [image, shape, transform, canvasSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  // 마우스 휠을 이용한 정밀 스케일 조절
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(15, prev.scale * delta))
      }));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [setTransform]);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (touches: React.TouchList) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const mid = getMidpoint(e.touches);
      dragStartPos.current = { x: mid.x, y: mid.y };
      initialTransform.current = { x: transform.x, y: transform.y };
      initialTouchDistance.current = getDistance(e.touches);
      initialScale.current = transform.scale;
    } else if (e.touches.length === 1) {
      dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialTransform.current = { x: transform.x, y: transform.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistance.current !== null) {
      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialTouchDistance.current;
      
      // 감도 조절을 가미한 스케일링
      const newScale = Math.max(0.1, Math.min(15, initialScale.current * ratio));

      // 위치 이동 동시 처리
      const mid = getMidpoint(e.touches);
      const dx = mid.x - dragStartPos.current.x;
      const dy = mid.y - dragStartPos.current.y;

      setTransform(prev => ({
        ...prev,
        x: initialTransform.current.x + dx,
        y: initialTransform.current.y + dy,
        scale: newScale
      }));
    } else if (e.touches.length === 1 && initialTouchDistance.current === null) {
      const dx = e.touches[0].clientX - dragStartPos.current.x;
      const dy = e.touches[0].clientY - dragStartPos.current.y;
      setTransform(prev => ({
        ...prev,
        x: initialTransform.current.x + dx,
        y: initialTransform.current.y + dy
      }));
    }
  };

  const handleTouchEnd = () => {
    initialTouchDistance.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    initialTransform.current = { x: transform.x, y: transform.y };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    const onMouseMove = (ev: MouseEvent) => {
      setTransform(prev => ({
        ...prev,
        x: initialTransform.current.x + (ev.clientX - dragStartPos.current.x),
        y: initialTransform.current.y + (ev.clientY - dragStartPos.current.y)
      }));
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="relative group">
      <div 
        className="canvas-checkerboard rounded-[48px] shadow-2xl overflow-visible cursor-move touch-none border-[12px] border-white ring-1 ring-slate-200 transition-all active:scale-[0.995]"
        style={{ width: canvasSize, height: canvasSize }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
          style={{ width: canvasSize, height: canvasSize }}
        />
      </div>
      
      <div className="absolute -bottom-14 left-0 right-0 flex justify-center opacity-60 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="glass px-5 py-2 rounded-full border border-slate-200/50 shadow-sm flex items-center gap-3">
           <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.1em] uppercase">
            Pan to Move • Scroll or Pinch to Zoom
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
