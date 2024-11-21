import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { Checkbox } from '@/app/components/checkbox';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import config from '@/moonshot.config';

type CookbookSelectionItemProps = {
  cookbook: Cookbook;
  selected: boolean;
  onSelect: (cookbook: Cookbook) => void;
  onAboutClick: (cookbook: Cookbook) => void;
};

function CookbookSelectionItem(props: CookbookSelectionItemProps) {
  const { cookbook, selected, onSelect, onAboutClick } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const requiredEndpoints = cookbook.endpoint_required;
  function handleClick(
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) {
    e.stopPropagation();
    setIsSelected(!isSelected);
    onSelect(cookbook);
  }

  return (
    <li
      role="cookbookcard"
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
      <header className="flex flex-basis-[100%] justify-between gap-2">
        <div className="flex gap-2 text-white items-start">
          <Icon
            name={IconName.Book}
            style={{ marginTop: 2 }}
          />
          <h3 className="font-bold ">{cookbook.name}</h3>
        </div>
        <Checkbox
          label=""
          size="s"
          ariaLabel={`Select ${cookbook.id}`}
          checked={isSelected}
          onChange={handleClick}
        />
      </header>
      <div className="flex flex-wrap gap-2 my-2">
        {config.cookbookTags[cookbook.id]?.map((tagName) => (
          <Button
            key={tagName}
            mode={ButtonType.OUTLINE}
            text={tagName}
            size="sm"
            btnColor={colors.moonpurple}
            hoverBtnColor={colors.moonpurple}
          />
        ))}
      </div>
      <p className="break-all break-words">{cookbook.description}</p>
      <footer className="flex justify-between mt-4">
        <div className="flex flex-col">
          <p>{cookbook.total_prompt_in_cookbook} prompts</p>
          <p>
            {cookbook.total_dataset_in_cookbook}&nbsp;
            {cookbook.total_dataset_in_cookbook > 1 ? 'Datasets' : 'Dataset'}
          </p>
        </div>
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
