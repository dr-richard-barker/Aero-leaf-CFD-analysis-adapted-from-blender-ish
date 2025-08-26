import React, { useState, useRef, useCallback } from 'react';
import { StreamlineData } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { RotateCcwIcon } from './icons/RotateCcwIcon';

interface Simulation3DViewerProps {
  streamlinesData: StreamlineData[];
}

const initialRotation = { x: -20, y: -30 };
const ZOOM_STEP = 0.15;
const MAX_ZOOM = 2.5;
const MIN_ZOOM = 0.4;

const ControlButton: React.FC<{ onClick: () => void; 'aria-label': string; children: React.ReactNode }> = ({ onClick, children, ...props }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-full bg-surface/70 text-text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
    {...props}
  >
    {children}
  </button>
);

const Simulation3DViewer: React.FC<Simulation3DViewerProps> = ({ streamlinesData }) => {
  const [rotation, setRotation] = useState(initialRotation);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
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
      x: Math.max(-90, Math.min(90, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5,
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseLeave = useCallback(() => setIsDragging(false), []);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  const handleResetView = () => {
    setRotation(initialRotation);
    setZoom(1);
    setAnimationSpeed(1.0);
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none relative bg-gray-900 rounded-lg overflow-hidden`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
        <style>
        {`
            @keyframes streamline-flow {
                to {
                    stroke-dashoffset: 0;
                }
            }
        `}
        </style>

        <div className="absolute w-full h-full" style={{ perspective: '1500px' }}>
            <div
                className="absolute w-full h-full transition-transform duration-75 ease-out"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                }}
            >
                {/* Detailed 3D CSS Leaf Model */}
                <div className="absolute top-1/2 left-1/2" style={{transformStyle: 'preserve-3d', transform: 'translateZ(0px) rotateZ(-20deg) rotateX(10deg) translateY(-20px)' }}>
                    {/* Midrib / Center Vein */}
                    <div className="absolute w-[4px] h-[220px] bg-green-900/80 rounded-full" 
                        style={{transform: 'translate(-50%, -50%) translateZ(1px)'}} />
                    
                    {/* Left Leaf Blade */}
                    <div className="absolute w-[90px] h-[210px] origin-right"
                        style={{
                            transform: 'translate(-100%, -50%) rotateY(-35deg)', 
                            background: 'linear-gradient(to right, #2E7D32, #66BB6A)',
                            borderRadius: '80% 0 60% 0',
                        }}>
                        {/* Secondary Veins Left */}
                        {[...Array(4)].map((_, i) => (
                            <div key={`vein-l-${i}`} className="absolute w-[1px] h-[50px] bg-green-900/50" style={{
                                top: `${30 + i * 15}%`,
                                left: '50%',
                                transformOrigin: 'bottom left',
                                transform: `rotate(${-45 - i * 5}deg) translateX(-50%)`
                            }} />
                        ))}
                    </div>

                    {/* Right Leaf Blade */}
                    <div className="absolute w-[90px] h-[210px] origin-left"
                        style={{
                            transform: 'translate(0%, -50%) rotateY(35deg)', 
                            background: 'linear-gradient(to left, #388E3C, #81C784)',
                            borderRadius: '0 80% 0 60%',
                        }}>
                        {/* Secondary Veins Right */}
                        {[...Array(4)].map((_, i) => (
                            <div key={`vein-r-${i}`} className="absolute w-[1px] h-[50px] bg-green-900/50" style={{
                                top: `${30 + i * 15}%`,
                                right: '50%',
                                transformOrigin: 'bottom right',
                                transform: `rotate(${45 + i * 5}deg) translateX(50%)`
                            }} />
                        ))}
                    </div>

                    {/* Petiole (stem) */}
                    <div className="absolute w-[6px] h-[60px] bg-yellow-900/80"
                        style={{
                            transformOrigin: 'top center',
                            transform: 'translate(-50%, 100px) rotateX(70deg)'
                        }} />
                </div>
                
                {/* SVG Streamlines */}
                <svg
                    viewBox="-300 -200 600 400"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    overflow="visible"
                >
                    {streamlinesData.map((line, i) => {
                      // Dynamically calculate dash properties based on velocity (proxied by duration)
                      // Faster flow (shorter duration) results in longer, faster dashes.
                      const velocityFactor = Math.max(0.2, 3.5 / line.duration); 
                      const dashLength = Math.max(5, Math.min(40, 15 * velocityFactor));
                      const gapLength = dashLength * 2;
                      const strokeDashoffset = dashLength + gapLength;

                      return (
                        <path
                            key={i}
                            d={line.d}
                            fill="none"
                            stroke={line.stroke}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={`${dashLength} ${gapLength}`}
                            style={{
                                strokeDashoffset: strokeDashoffset,
                                animationName: 'streamline-flow',
                                animationDuration: `${line.duration / animationSpeed}s`,
                                animationTimingFunction: 'linear',
                                animationIterationCount: 'infinite',
                            }}
                        />
                      );
                    })}
                </svg>

            </div>
        </div>

        <div className="absolute top-4 left-4 text-text-primary bg-surface/50 px-3 py-1 rounded-md backdrop-blur-sm pointer-events-none">
            <h3 className="text-lg font-semibold">Live Airflow Visualization</h3>
            <p className="text-sm text-text-secondary">Drag to rotate view</p>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-3 z-10">
            <div className="flex flex-col gap-2">
                <ControlButton onClick={handleZoomIn} aria-label="Zoom In"><PlusIcon className="w-5 h-5" /></ControlButton>
                <ControlButton onClick={handleZoomOut} aria-label="Zoom Out"><MinusIcon className="w-5 h-5" /></ControlButton>
                <ControlButton onClick={handleResetView} aria-label="Reset View"><RotateCcwIcon className="w-5 h-5" /></ControlButton>
            </div>
            <div className="bg-surface/70 p-2 rounded-lg backdrop-blur-sm shadow-lg w-32">
                <label htmlFor="speed-slider" className="text-xs text-text-secondary text-center block mb-1">
                    Speed: {animationSpeed.toFixed(1)}x
                </label>
                <input
                    id="speed-slider"
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                    aria-label="Animation Speed"
                />
            </div>
        </div>
    </div>
  );
};

export default Simulation3DViewer;
