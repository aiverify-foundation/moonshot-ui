'use client';

import { useState } from 'react';

interface ToggleSwitchProps {
  name?: string;
  label?: string;
  value?: string;
  initialState?: boolean;
  onChange?: (isChecked: boolean) => void;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
  const { name, label, value, initialState = false, onChange } = props;
  const [isChecked, setIsChecked] = useState(initialState);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div
        className="relative"
        onClick={handleToggle}>
        <div
          className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${isChecked ? 'bg-moonpurplelight' : ''}`}
        />
        <div
          className={`absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform duration-300 ease-in-out ${isChecked ? 'transform translate-x-full' : ''}`}
        />
      </div>
      {label && <div className="ml-3 text-gray-700 font-medium">{label}</div>}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        value={value}
        name={name}
        style={{ display: 'none' }}
      />
    </label>
  );
}
