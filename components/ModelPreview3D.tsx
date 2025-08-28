import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { RotateCcwIcon } from './icons/RotateCcwIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface Vector3 { x: number; y: number; z: number; }

interface ModelPreview3DProps {
  file: File | null;
  fileName: string | null;
}

const initialRotation = { x: -25, y: -30 };
const ZOOM_STEP = 0.15;
const MAX_ZOOM = 5.0;
const MIN_ZOOM = 0.2;

const ControlButton: React.FC<{ onClick: () => void; 'aria-label': string; children: React.ReactNode }> = ({ onClick, children, ...props }) => (
    <button
        onClick={onClick}
        className="w-8 h-8 rounded-full bg-surface/70 text-text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        {...props}
    >
        {children}
    </button>
);

const parseObj = (content: string): Vector3[] => {
    const vertices: Vector3[] = [];
    content.split('\n').forEach(line => {
        if (line.startsWith('v ')) {
            const parts = line.split(/\s+/).slice(1);
            if (parts.length >= 3) {
                const v = { x: parseFloat(parts[0]), y: parseFloat(parts[1]), z: parseFloat(parts[2]) };
                if (![v.x, v.y, v.z].some(isNaN)) vertices.push(v);
            }
        }
    });
    return vertices;
};

const ModelPreview3D: React.FC<ModelPreview3DProps> = ({ file, fileName }) => {
    const [rotation, setRotation] = useState(initialRotation);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [vertices, setVertices] = useState<Vector3[]>([]);

    useEffect(() => {
        if (!file || !fileName) {
            setStatus('idle');
            setVertices([]);
            return;
        }

        if (!fileName.toLowerCase().endsWith('.obj')) {
            setStatus('error');
            setErrorMessage('Live preview is only available for .obj files.');
            setVertices([]);
            return;
        }

        setStatus('loading');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedVertices = parseObj(content);
                if (parsedVertices.length === 0) {
                    setStatus('error');
                    setErrorMessage('No vertices found in the .obj file.');
                    setVertices([]);
                } else {
                    setVertices(parsedVertices);
                    setStatus('success');
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage('Could not parse the .obj file.');
                setVertices([]);
            }
        };
        reader.onerror = () => {
            setStatus('error');
            setErrorMessage('Failed to read the file.');
            setVertices([]);
        };
        reader.readAsText(file);
    }, [file, fileName]);
    
    const centeredVertices = useMemo(() => {
        if (vertices.length === 0) return [];
        let min = { x: Infinity, y: Infinity, z: Infinity };
        let max = { x: -Infinity, y: -Infinity, z: -Infinity };
        vertices.forEach(v => {
            min.x = Math.min(min.x, v.x); min.y = Math.min(min.y, v.y); min.z = Math.min(min.z, v.z);
            max.x = Math.max(max.x, v.x); max.y = Math.max(max.y, v.y); max.z = Math.max(max.z, v.z);
        });
        const center = { x: (min.x + max.x) / 2, y: (min.y + max.y) / 2, z: (min.z + max.z) / 2 };
        const maxDim = Math.max(max.x - min.x, max.y - min.y, max.z - min.z);
        const scale = maxDim > 0 ? 150 / maxDim : 1;
        return vertices.map(v => ({
            x: (v.x - center.x) * scale,
            y: -(v.y - center.y) * scale, // Invert Y for CSS 3D
            z: (v.z - center.z) * scale,
        }));
    }, [vertices]);

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
    
    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    const handleMouseLeave = useCallback(() => setIsDragging(false), []);
    const handleZoomIn = () => setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    const handleResetView = () => { setRotation(initialRotation); setZoom(1); };

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center text-text-secondary h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary mb-2"></div>
                <p>Parsing 3D model...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center text-red-400 text-center p-4 h-full">
                <AlertTriangleIcon className="w-10 h-10 mb-3" />
                <p className="font-semibold text-lg">Preview Error</p>
                <p className="text-sm mt-1">{errorMessage}</p>
            </div>
        );
    }

    if (status !== 'success' || centeredVertices.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary text-center">Preview will appear here once a valid .obj model is loaded.</p>
            </div>
        );
    }

    return (
        <div
            className={`w-full h-full flex flex-col items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
        >
            <div className="w-full h-full" style={{ perspective: '1000px' }}>
                <div
                    className="w-full h-full transition-transform duration-75 ease-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                    }}
                >
                    {centeredVertices.map((v, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-accent rounded-full"
                            style={{
                                top: '50%', left: '50%',
                                transform: `translate3d(${v.x}px, ${v.y}px, ${v.z}px) translate(-50%, -50%)`,
                                boxShadow: '0 0 5px #4CAF50'
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                <ControlButton onClick={handleZoomIn} aria-label="Zoom In"><PlusIcon className="w-4 h-4" /></ControlButton>
                <ControlButton onClick={handleZoomOut} aria-label="Zoom Out"><MinusIcon className="w-4 h-4" /></ControlButton>
                <ControlButton onClick={handleResetView} aria-label="Reset View"><RotateCcwIcon className="w-4 h-4" /></ControlButton>
            </div>
        </div>
    );
};

export default ModelPreview3D;
