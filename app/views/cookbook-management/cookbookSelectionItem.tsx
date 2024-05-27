import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';

type CookbookSelectionItemProps = {
  cookbook: Cookbook;
  selected: boolean;
  onSelect: (cookbook: Cookbook) => void;
  onAboutClick: (cookbook: Cookbook) => void;
};

function CookbookSelectionItem(props: CookbookSelectionItemProps) {
  const { cookbook, selected, onSelect, onAboutClick } = props;
  const [isSelected, setIsSelected] = useState(selected);

  function handleClick(
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) {
    e.stopPropagation();
    setIsSelected(!isSelected);
    onSelect(cookbook);
  }

  return (
    <li
      className="flex flex-col gap-2 border rounded-lg p-6 cursor-pointer border-moongray-800
      text-white hover:bg-moongray-800 hover:border-moonwine-700 text-[0.9rem] mb-[15px]"
      style={{
        transition: 'background-color 0.2s ease-in-out',
        flexBasis: '49%',
        ...(isSelected
          ? {
              backgroundColor: colors.moongray['800'],
              borderColor: colors.moonpurple,
            }
          : {}),
      }}
      onClick={handleClick}>
      <header className="flex flex-basis-[100%] justify-between">
        <div className="flex gap-2 text-white">
          <Icon name={IconName.Book} />
          <h3 className="font-bold">{cookbook.name}</h3>
        </div>
        <input
          type="checkbox"
          className="w-2 h-2 shrink-0"
          checked={isSelected}
        />
      </header>
      <p>{cookbook.description}</p>
      <footer className="flex justify-between">
        <p>{cookbook.total_prompt_in_cookbook} prompts</p>
        <span
          className="decoration-1 underline cursor-pointer hover:text-moonwine-500"
          onClick={(e) => {
            e.stopPropagation();
            onAboutClick(cookbook);
          }}>
          About
        </span>
      </footer>
    </li>
  );
}

export { CookbookSelectionItem };
