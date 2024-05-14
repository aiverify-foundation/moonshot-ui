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
  children?: React.ReactNode;
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
    children,
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
      className="flex gap-2 border bg-moongray-950 rounded-xl
          p-4 px-6 items-center cursor-pointer
        hover:bg-moongray-800 hover:border-moonwine-700 mb-[15px]"
      style={{
        flexBasis: '49%',
        height,
        backgroundColor: bgColor,
        transition: 'background-color 0.2s ease-in-out',
      }}
      onClick={handleClick}>
      <section className="flex flex-col w-full justify-start gap-3">
        <div className="flex flex-row gap-2 text-white">
          <Icon name={iconName} />
          <h4 className="text-[1rem]">{label}</h4>
        </div>
        {children}
      </section>
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
