import React, { useState, useRef } from 'react';
import { DomainParams } from '../types';

interface DomainVisualizerProps {
  params: DomainParams;
}

const DomainVisualizer: React.FC<DomainVisualizerProps> = ({ params }) => {
  const [rotation, setRotation] = useState({ x: -25, y: -30 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({
      x: prev.x - dy * 0.5,
      y: prev.y + dx * 0.5,
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const vizContainerSize = 300;
  const { sizeX, sizeY, sizeZ, inlet, outlet } = params;
  const maxDim = Math.max(sizeX, sizeY, sizeZ, 5);
  const scale = vizContainerSize / maxDim;

  const width = sizeX * scale; // Corresponds to X-axis
  const depth = sizeY * scale; // Corresponds to Y-axis
  const height = sizeZ * scale; // Corresponds to Z-axis
  
  const axisArmLength = vizContainerSize * 0.5;

  const getFaceClass = (faceName: string) => {
    let baseClass = 'absolute flex items-center justify-center border text-sm font-medium capitalize transition-colors duration-200';
    if (inlet === faceName) {
      return `${baseClass} bg-green-500/80 border-green-400 text-white font-bold`;
    }
    if (outlet === faceName) {
      return `${baseClass} bg-red-500/80 border-red-400 text-white font-bold`;
    }
    return `${baseClass} bg-surface/60 border-border text-text-secondary backdrop-blur-sm`;
  };
  
  const getFaceLabel = (faceName: string) => {
    let baseLabel = faceName;
    if (inlet === faceName) baseLabel = `Inlet`;
    if (outlet === faceName) baseLabel = `Outlet`;

    switch(faceName) {
      case 'right': return `${baseLabel} (+X)`;
      case 'left': return `${baseLabel} (-X)`;
      case 'front': return `${baseLabel} (+Y)`;
      case 'back': return `${baseLabel} (-Y)`;
      case 'top': return `${baseLabel} (+Z)`;
      case 'bottom': return `${baseLabel} (-Z)`;
      default: return baseLabel;
    }
  }

  const faces = [
    { name: 'front', style: { width: `${width}px`, height: `${height}px`, transform: `rotateY(0deg) translateZ(${depth / 2}px)` } },
    { name: 'back', style: { width: `${width}px`, height: `${height}px`, transform: `rotateY(180deg) translateZ(${depth / 2}px)` } },
    { name: 'right', style: { width: `${depth}px`, height: `${height}px`, transform: `rotateY(90deg) translateZ(${width / 2}px)` } },
    { name: 'left', style: { width: `${depth}px`, height: `${height}px`, transform: `rotateY(-90deg) translateZ(${width / 2}px)` } },
    { name: 'top', style: { width: `${width}px`, height: `${depth}px`, transform: `rotateX(90deg) translateZ(${height / 2}px)` } },
    { name: 'bottom', style: { width: `${width}px`, height: `${depth}px`, transform: `rotateX(-90deg) translateZ(${height / 2}px)` } },
  ];

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
        <div
          className="absolute w-full h-full transition-transform duration-75 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-150px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Cube Faces */}
          {faces.map(face => (
            <div
              key={face.name}
              className={getFaceClass(face.name)}
              style={{
                ...face.style,
                left: `calc(50% - ${parseFloat(face.style.width) / 2}px)`,
                top: `calc(50% - ${parseFloat(face.style.height) / 2}px)`,
              }}
            >
              <span className="p-1">{getFaceLabel(face.name)}</span>
            </div>
          ))}

          {/* Axis indicators */}
          <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{transformStyle: 'preserve-3d'}}>
            {/* Lines (map CFD axes to CSS 3D axes) */}
            {/* X-axis (+/-) */}
            <div className="absolute h-[2px] bg-red-500/70" style={{width: axisArmLength, transform: 'translateY(-1px)'}} />
            <div className="absolute h-[2px] bg-red-500/30" style={{width: axisArmLength, transformOrigin: '0 50%', transform: 'translateY(-1px) rotateY(180deg)'}} />
            {/* Y-axis (CFD) mapped to Z-axis (CSS) */}
            <div className="absolute h-[2px] bg-green-500/70" style={{width: axisArmLength, transformOrigin: '0 50%', transform: 'translateY(-1px) rotateY(-90deg)'}} />
            <div className="absolute h-[2px] bg-green-500/30" style={{width: axisArmLength, transformOrigin: '0 50%', transform: 'translateY(-1px) rotateY(90deg)'}} />
            {/* Z-axis (CFD) mapped to -Y-axis (CSS) */}
            <div className="absolute h-[2px] bg-blue-500/70" style={{width: axisArmLength, transformOrigin: '0 50%', transform: 'translateY(-1px) rotateX(-90deg)'}} />
            <div className="absolute h-[2px] bg-blue-500/30" style={{width: axisArmLength, transformOrigin: '0 50%', transform: 'translateY(-1px) rotateX(90deg)'}} />

            {/* Labels (billboarded to face camera) */}
            {/* X Labels */}
            <div className="absolute top-1/2 left-1/2 text-red-400 font-bold text-xs" style={{transform: `translateX(${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>+X</div>
            <div className="absolute top-1/2 left-1/2 text-red-400/70 font-bold text-xs" style={{transform: `translateX(-${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>-X</div>
            
            {/* Y Labels */}
            <div className="absolute top-1/2 left-1/2 text-green-400 font-bold text-xs" style={{transform: `translateZ(${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>+Y</div>
            <div className="absolute top-1/2 left-1/2 text-green-400/70 font-bold text-xs" style={{transform: `translateZ(-${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>-Y</div>
            
            {/* Z Labels */}
            <div className="absolute top-1/2 left-1/2 text-blue-400 font-bold text-xs" style={{transform: `translateY(-${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>+Z</div>
            <div className="absolute top-1/2 left-1/2 text-blue-400/70 font-bold text-xs" style={{transform: `translateY(${axisArmLength}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`}}>-Z</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainVisualizer;