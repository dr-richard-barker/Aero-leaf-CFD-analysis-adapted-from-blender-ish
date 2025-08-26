
import React from 'react';
import { EnvironmentParams } from '../../types';
import Slider from '../ui/Slider';
import InputField from '../ui/InputField';

interface Step3Props {
  params: EnvironmentParams;
  onParamChange: <K extends keyof EnvironmentParams>(field: K, value: EnvironmentParams[K]) => void;
}

const Step3_Environment: React.FC<Step3Props> = ({ params, onParamChange }) => {
    const handleChange = (field: keyof EnvironmentParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onParamChange(field, parseFloat(e.target.value));
    };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">3. Environmental Parameters</h2>
      <p className="text-text-secondary mb-6">Define the atmospheric conditions for the simulation.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Slider 
            label="Wind Speed"
            id="windSpeed"
            value={params.windSpeed}
            onChange={handleChange('windSpeed')}
            min={0} max={30} step={0.1} unit="m/s"
        />
        <Slider 
            label="Wind Direction"
            id="windDirection"
            value={params.windDirection}
            onChange={handleChange('windDirection')}
            min={0} max={360} step={1} unit="°"
        />
        <Slider 
            label="Ambient Temperature"
            id="temperature"
            value={params.temperature}
            onChange={handleChange('temperature')}
            min={-20} max={50} step={0.5} unit="°C"
        />
        <InputField
            label="Ambient Pressure"
            id="pressure"
            type="number"
            value={params.pressure}
            onChange={handleChange('pressure')}
            unit="Pa"
            step={100}
        />
        <InputField
            label="Air Density"
            id="airDensity"
            type="number"
            value={params.airDensity}
            onChange={handleChange('airDensity')}
            unit="kg/m³"
            step={0.001}
        />
        <InputField
            label="Air Viscosity"
            id="viscosity"
            type="number"
            value={params.viscosity}
            onChange={handleChange('viscosity')}
            unit="Pa·s"
            step={1e-7}
        />
      </div>
    </div>
  );
};

export default Step3_Environment;
