import { useState } from 'react';
import { IconName, Icon } from '@/app/components/IconSVG';

type Props<T> = {
  item: T;
  label: string;
  height?: number;
  onClick: (item: T) => void;
  iconName: IconName;
};

function SelectListItem<T>(props: Props<T>) {
  const { label, item, onClick, iconName, height } = props;
  const [checked, setChecked] = useState(false);

  function handleClick() {
    setChecked((prev) => !prev);
    onClick(item);
  }

  return (
    <li
      className="flex flex-row gap-2 border dark:border-moongray-200
        bg-moongray-950 rounded-xl p-8 items-center cursor-pointer
        dark:hover:bg-moongray-900 mb-[15px] justify-between"
      style={{ flexBasis: '49%', height }}
      onClick={handleClick}>
      <div className="flex flex-row gap-2 text-white justify-center items-center">
        <Icon name={iconName} />
        <h4 className="text-[1.3rem]">{label}</h4>
      </div>
      <input
        type="checkbox"
        className="w-4 h-4 mr-5 ml-2 shrink-0"
        checked={checked}
        onChange={handleClick}
      />
    </li>
  );
}

export { SelectListItem };
