import { useEffect, useState } from 'react';
import { IconName, Icon } from '@/app/components/IconSVG';

type Props<T> = {
  item: T;
  label: string;
  height?: number;
  bgColor?: string;
  checked?: boolean;
  onClick: (item: T) => void;
  iconName: IconName;
};

function SelectListItem<T>(props: Props<T>) {
  const {
    label,
    item,
    onClick,
    iconName,
    height,
    bgColor,
    checked = false,
  } = props;
  const [isChecked, setIsChecked] = useState(checked);

  function handleClick() {
    setIsChecked((prev) => !prev);
    onClick(item);
  }

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <li
      className="flex flex-row gap-2 border dark:border-moongray-200
        bg-moongray-950 rounded-xl p-4 px-6 items-center cursor-pointer
        hover:bg-moongray-800 hover:border-moonwine-700
        dark:hover:bg-moongray-900 mb-[15px] justify-between"
      style={{
        flexBasis: '49%',
        height,
        backgroundColor: bgColor,
        transition: 'background-color 0.2s ease-in-out',
      }}
      onClick={handleClick}>
      <div className="flex flex-row gap-2 text-white justify-center items-center">
        <Icon name={iconName} />
        <h4 className="text-[1rem]">{label}</h4>
      </div>
      <input
        type="checkbox"
        className="w-4 h-4 shrink-0"
        checked={isChecked}
        onChange={handleClick}
      />
    </li>
  );
}

export { SelectListItem };
