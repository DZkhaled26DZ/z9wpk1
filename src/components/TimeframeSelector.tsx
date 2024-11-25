import React from 'react';

interface TimeframeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function TimeframeSelector({ value, onChange, options }: TimeframeSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default TimeframeSelector;