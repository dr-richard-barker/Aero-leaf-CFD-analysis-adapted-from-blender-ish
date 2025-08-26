
import React from 'react';
import { SolverParams, SimulationParams } from '../../types';
import SelectField from '../ui/SelectField';
import InputField from '../ui/InputField';
import SimulationSummary from '../SimulationSummary';

interface Step4Props {
  params: SolverParams;
  allParams: SimulationParams;
  onParamChange: <K extends keyof SolverParams>(field: K, value: SolverParams[K]) => void;
}

const Step4_SolverSettings: React.FC<Step4Props> = ({ params, onParamChange, allParams }) => {
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
        />
        
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Meshing Level</label>
          <div className="grid grid-cols-3 gap-4">
            {['coarse', 'medium', 'fine'].map(level => (
              <button
                key={level}
                onClick={() => onParamChange('meshingLevel', level as 'coarse' | 'medium' | 'fine')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${params.meshingLevel === level ? 'border-secondary bg-blue-900/30' : 'border-border bg-gray-700 hover:border-gray-500'}`}
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
            <InputField
                label="Time Step"
                id="timeStep"
                type="number"
                value={params.timeStep}
                onChange={handleInputChange('timeStep')}
                unit="s"
                step={0.001}
                min={0.0001}
            />
        </div>
        
        <div className="bg-green-900/20 border border-accent rounded-lg p-4 text-sm text-green-300">
            <p><strong className="font-semibold">Note:</strong> Finer meshes and advanced turbulence models (LES/DES) significantly increase computation time and cost.</p>
        </div>
      </div>
      <SimulationSummary params={allParams} />
    </div>
  );
};

export default Step4_SolverSettings;
