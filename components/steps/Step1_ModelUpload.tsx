
import React, { useRef } from 'react';
import { ModelParams } from '../../types';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { FileIcon } from '../icons/FileIcon';
import ModelPreview3D from '../ModelPreview3D';

interface Step1Props {
  params: ModelParams;
  onParamChange: <K extends keyof ModelParams>(field: K, value: ModelParams[K]) => void;
}

const Step1_ModelUpload: React.FC<Step1Props> = ({ params, onParamChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onParamChange('file', file);
      onParamChange('fileName', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onParamChange('file', file);
      onParamChange('fileName', file.name);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleLoadDemo = () => {
    const demoObjContent = `# AeroLeaf CFD Demo Model
# A simple, stylized leaf for quick simulations.
# Vertices
v 0.0 0.0 0.0   # 1 - Base of leaf blade
v -0.8 1.5 0.0  # 2 - Left bottom
v -1.2 3.5 0.0  # 3 - Left middle
v -0.5 5.0 0.0  # 4 - Left top
v 0.0 6.0 0.0   # 5 - Tip of leaf
v 0.5 5.0 0.0   # 6 - Right top
v 1.2 3.5 0.0   # 7 - Right middle
v 0.8 1.5 0.0   # 8 - Right bottom

# Faces (triangulated for simplicity)
f 1 2 3
f 1 3 4
f 1 4 5
f 1 5 6
f 1 6 7
f 1 7 8
f 1 8 2
`;
    const demoFile = new File([demoObjContent], "demo-leaf.obj", { type: "text/plain" });
    onParamChange('file', demoFile);
    onParamChange('fileName', demoFile.name);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">1. 3D Leaf Model</h2>
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Upload 3D Model</label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-secondary transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={openFileDialog}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".obj,.fbx,.stl,.gltf"
            />
            {params.fileName ? (
              <div className="flex flex-col items-center text-accent">
                <FileIcon className="w-12 h-12 mb-2" />
                <p className="font-semibold">{params.fileName}</p>
                <p className="text-sm text-text-secondary">Click or drag to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-text-secondary">
                 <UploadCloudIcon className="w-12 h-12 mb-2"/>
                 <p className="font-semibold">Click to browse or drag & drop</p>
                 <p className="text-sm">Supported formats: .obj, .fbx, .stl</p>
              </div>
            )}
          </div>
           <div className="text-center mt-4">
            <p className="text-sm text-text-secondary">
              Don't have a model?{' '}
              <button
                onClick={handleLoadDemo}
                className="text-secondary hover:text-blue-400 font-semibold underline focus:outline-none focus:ring-2 focus:ring-secondary rounded"
              >
                Load a demo leaf
              </button>
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Leaf Geometry Type</label>
          <div className="flex space-x-4">
            {['realistic', 'simplified'].map(type => (
              <button
                key={type}
                onClick={() => onParamChange('geometryType', type as 'realistic' | 'simplified')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${params.geometryType === type ? 'border-secondary bg-blue-900/30' : 'border-border bg-gray-700 hover:border-gray-500'}`}
              >
                <h4 className="font-semibold capitalize">{type}</h4>
                <p className="text-sm text-text-secondary">
                  {type === 'realistic' ? 'High-fidelity model with detailed textures.' : 'Basic shape for faster initial simulations.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Model Preview</h4>
            <div className="w-full aspect-video bg-gray-900 rounded-md flex items-center justify-center p-4 relative overflow-hidden">
                {params.file ? (
                  <ModelPreview3D file={params.file} fileName={params.fileName} />
                ) : (
                  <p className="text-text-secondary">3D model preview will appear here</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_ModelUpload;
