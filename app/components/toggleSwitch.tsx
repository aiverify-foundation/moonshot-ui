'use client';

import { useState } from 'react';

interface ToggleSwitchProps {
  name?: string;
  label?: string;
  value?: string;
  defaultChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
  const { name, label, value, defaultChecked = false, onChange } = props;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  function toggle() {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  }

  return (
    <label className="flex items-center cursor-pointer">
      <div
        role="toggle-switch"
        className="relative"
        onClick={toggle}>
        <div
          className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${isChecked ? 'bg-moonpurplelight' : ''}`}
        />
        <div
          className={`absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform duration-300 ease-in-out ${isChecked ? 'transform translate-x-full' : ''}`}
        />
      </div>
      {label && <div className="ml-3 text-gray-700 font-medium">{label}</div>}
      <input
        readOnly
        type="checkbox"
        defaultChecked={isChecked}
        defaultValue={value}
        name={name}
        style={{ display: 'none' }}
      />
    </label>
  );
}
