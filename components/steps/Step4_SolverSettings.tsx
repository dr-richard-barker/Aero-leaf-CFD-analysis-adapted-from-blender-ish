

import React from 'react';
import { SolverParams } from '../../types';
import SelectField from '../ui/SelectField';
import InputField from '../ui/InputField';
import Slider from '../ui/Slider';
import { InfoIcon } from '../icons/InfoIcon';

interface Step4Props {
  params: SolverParams;
  onParamChange: <K extends keyof SolverParams>(field: K, value: SolverParams[K]) => void;
}

const TurbulenceModelTooltipContent = () => (
    <div className="text-left space-y-2">
      <p><strong>RANS:</strong> Computationally efficient, best for steady-state flows. Less accurate for highly turbulent conditions.</p>
      <p><strong>LES:</strong> More accurate for complex, unsteady flows by resolving large eddies. Computationally expensive.</p>
      <p><strong>DES:</strong> Hybrid model combining RANS near surfaces and LES elsewhere. Balances accuracy and cost.</p>
    </div>
);

const MeshingLevelTooltipContent = () => (
    <div className="text-left space-y-2">
        <p><strong>Coarse:</strong> Fastest computation with lowest accuracy. Good for initial checks and rapid iteration.</p>
        <p><strong>Medium:</strong> A good balance between computational cost and accuracy. Recommended for most standard simulations.</p>
        <p><strong>Fine:</strong> Highest accuracy for detailed analysis, but significantly increases computation time and resource requirements.</p>
    </div>
);


const Step4_SolverSettings: React.FC<Step4Props> = ({ params, onParamChange }) => {
  const handleSelectChange = (field: keyof SolverParams) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onParamChange(field, e.target.value as any);
  };

  const handleInputChange = (field: keyof SolverParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamChange(field, parseFloat(e.target.value));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">4. CFD Solver Settings</h2>
      <div className="space-y-6">
        <SelectField
            label="Turbulence Model"
            id="turbulenceModel"
            value={params.turbulenceModel}
            onChange={handleSelectChange('turbulenceModel')}
            options={[
                { value: 'RANS', label: 'RANS (Reynolds-Averaged Navier-Stokes)'},
                { value: 'LES', label: 'LES (Large Eddy Simulation)'},
                { value: 'DES', label: 'DES (Detached Eddy Simulation)'},
            ]}
            tooltip={<TurbulenceModelTooltipContent />}
        />
        
        <div>
            <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-text-secondary">Meshing Level</label>
                 <div className="relative group">
                    <InfoIcon className="w-4 h-4 text-text-secondary cursor-pointer" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 border border-border text-text-secondary text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <MeshingLevelTooltipContent />
                    </div>
                </div>
            </div>
          <div className="grid grid-cols-3 gap-4">
            {['coarse', 'medium', 'fine'].map(level => (
              <button
                key={level}
                onClick={() => onParamChange('meshingLevel', level as 'coarse' | 'medium' | 'fine')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${params.meshingLevel === level ? 'border-secondary bg-blue-900/50 ring-2 ring-secondary ring-offset-2 ring-offset-surface' : 'border-border bg-gray-700 hover:border-gray-500'}`}
              >
                <h4 className="font-semibold capitalize">{level}</h4>
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
            <InputField
                label="Simulation Run Time"
                id="runTime"
                type="number"
                value={params.runTime}
                onChange={handleInputChange('runTime')}
                unit="s"
                step={1}
                min={1}
            />
            <Slider
                label="Time Step"
                id="timeStep"
                value={params.timeStep}
                onChange={handleInputChange('timeStep')}
                min={0.001}
                max={0.1}
                step={0.001}
                unit="s"
            />
        </div>
        
        <div className="bg-green-900/20 border border-accent rounded-lg p-4 text-sm text-green-300">
            <p><strong className="font-semibold">Note:</strong> Finer meshes and advanced turbulence models (LES/DES) significantly increase computation time and cost.</p>
        </div>
      </div>
    </div>
  );
};

export default Step4_SolverSettings;