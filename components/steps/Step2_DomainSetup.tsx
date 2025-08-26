
import React from 'react';
import { DomainParams } from '../../types';
import Slider from '../ui/Slider';
import SelectField from '../ui/SelectField';

interface Step2Props {
  params: DomainParams;
  onParamChange: <K extends keyof DomainParams>(field: K, value: DomainParams[K]) => void;
}

const Step2_DomainSetup: React.FC<Step2Props> = ({ params, onParamChange }) => {
  const handleSliderChange = (field: keyof DomainParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamChange(field, parseFloat(e.target.value));
  };
  
  const handleSelectChange = (field: keyof DomainParams) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onParamChange(field, e.target.value as any);
  };

  const boundaryOptions = [
      {value: 'front', label: 'Front'},
      {value: 'back', label: 'Back'},
      {value: 'left', label: 'Left'},
      {value: 'right', label: 'Right'},
      {value: 'top', label: 'Top'},
      {value: 'bottom', label: 'Bottom'},
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">2. CFD Domain Setup</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Slider 
                label="Domain Size X"
                id="sizeX"
                value={params.sizeX}
                onChange={handleSliderChange('sizeX')}
                min={1} max={50} step={0.5} unit="m"
            />
            <Slider 
                label="Domain Size Y"
                id="sizeY"
                value={params.sizeY}
                onChange={handleSliderChange('sizeY')}
                min={1} max={50} step={0.5} unit="m"
            />
            <Slider 
                label="Domain Size Z"
                id="sizeZ"
                value={params.sizeZ}
                onChange={handleSliderChange('sizeZ')}
                min={1} max={50} step={0.5} unit="m"
            />
        </div>

        <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Boundary Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                    label="Inlet (Airflow Source)"
                    id="inlet"
                    value={params.inlet}
                    onChange={handleSelectChange('inlet')}
                    options={boundaryOptions.filter(opt => opt.value !== params.outlet)}
                />
                <SelectField 
                    label="Outlet (Airflow Exit)"
                    id="outlet"
                    value={params.outlet}
                    onChange={handleSelectChange('outlet')}
                    options={boundaryOptions.filter(opt => opt.value !== params.inlet)}
                />
            </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Domain Visualization</h4>
            <div className="w-full aspect-video bg-gray-900 rounded-md flex items-center justify-center">
                <p className="text-text-secondary">Computational domain preview</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_DomainSetup;
