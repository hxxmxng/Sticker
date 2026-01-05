
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

    // 1. 도형 프레임(마스크) 설정
    // 캔버스의 약 80% 크기로 중앙에 배치 (여유 공간 확보)
    const frameSize = canvasSize * 0.8;
    const shapeScale = frameSize / 100;

    // 오프스크린 버퍼에서 합성 작업 수행
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
    
    // 사진의 기준점은 캔버스 중앙
    bctx.translate(canvasSize / 2 + transform.x, canvasSize / 2 + transform.y);
    bctx.rotate((transform.rotation * Math.PI) / 180);
    
    const imgWidth = image.width;
    const imgHeight = image.height;
    
    // 사진의 기본 크기를 프레임에 맞춤 (Cover 방식)
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

    // 결과물을 메인 캔버스에 렌더링
    ctx.drawImage(buffer, 0, 0, canvasSize, canvasSize);

    // 가이드 라인 (선택 사항: 편집 중임을 알리는 얇은 테두리)
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(shapeScale, shapeScale);
    ctx.translate(-50, -50);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1 / shapeScale;
    ctx.stroke(shapePath);
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
      const mid = getMidpoint(e.touches);
      const dx = mid.x - dragStartPos.current.x;
      const dy = mid.y - dragStartPos.current.y;

      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialTouchDistance.current;
      const newScale = Math.max(0.1, Math.min(10, initialScale.current * ratio));

      setTransform(prev => ({
        ...prev,
        x: initialTransform.current.x + dx,
        y: initialTransform.current.y + dy,
        scale: newScale
      }));
    } else if (e.touches.length === 1) {
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
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.1em] uppercase">
            Pan & Pinch to Crop Photo
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
