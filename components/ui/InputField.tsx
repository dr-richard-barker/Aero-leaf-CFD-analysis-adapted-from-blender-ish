
import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type, value, onChange, unit, step, min, max }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
          className="w-full bg-gray-700 border border-border rounded-md shadow-sm p-2 text-text-primary focus:ring-secondary focus:border-secondary"
        />
        {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-text-secondary">{unit}</span>}
      </div>
    </div>
  );
};

export default InputField;
