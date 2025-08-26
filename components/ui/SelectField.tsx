import React from 'react';
import { InfoIcon } from '../icons/InfoIcon';

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  tooltip?: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, options, tooltip }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
        {tooltip && (
          <div className="relative group">
            <InfoIcon className="w-4 h-4 text-text-secondary cursor-pointer" />
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 border border-border text-text-secondary text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-border rounded-md shadow-sm p-2 text-text-primary focus:ring-secondary focus:border-secondary"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;