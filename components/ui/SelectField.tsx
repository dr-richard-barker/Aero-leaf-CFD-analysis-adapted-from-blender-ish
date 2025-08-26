
import React from 'react';

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
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
