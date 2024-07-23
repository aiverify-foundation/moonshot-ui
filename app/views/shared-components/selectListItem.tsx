import React, { useEffect, useState } from 'react';
import { IconName, Icon } from '@/app/components/IconSVG';

type Props<T> = {
  item: T;
  label: string;
  height?: number;
  bgColor?: React.CSSProperties['backgroundColor'];
  hideCheckbox?: boolean;
  checked?: boolean;
  onClick: (item: T) => void;
  iconName: IconName;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

function SelectListItem<T>(props: Props<T>) {
  const {
    label,
    item,
    onClick,
    iconName,
    height,
    bgColor,
    hideCheckbox = false,
    checked = false,
    children,
    style,
  } = props;
  const [isChecked, setIsChecked] = useState(checked);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    setIsChecked((prev) => !prev);
    onClick(item);
  }

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <li
      className="flex gap-2 border bg-moongray-950 rounded-xl
          p-4 px-6 items-center cursor-pointer
        hover:bg-moongray-800 hover:border-moonwine-700 mb-[15px]"
      style={{
        flexBasis: '49%',
        height,
        backgroundColor: bgColor,
        transition: 'background-color 0.2s ease-in-out',
        ...style,
      }}
      onClick={handleClick}>
      <section className="flex flex-col w-full justify-start gap-3">
        <div className="flex flex-row gap-2 text-white">
          <Icon name={iconName} />
          <h4 className="text-[1rem]">{label}</h4>
        </div>
        {children}
      </section>
      {!hideCheckbox && (
        <input
          type="checkbox"
          aria-label={`Select ${label}`}
          className="w-4 h-4 shrink-0"
          checked={isChecked}
          readOnly
        />
      )}
    </li>
  );
}

export { SelectListItem };
