
import React from 'react';

interface SliderProps {
  label: string;
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ label, id, value, onChange, min, max, step, unit }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-semibold text-text-primary">{value} {unit}</span>
      </div>
      <input
        type="range"
        id={id}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
      />
    </div>
  );
};

export default Slider;
