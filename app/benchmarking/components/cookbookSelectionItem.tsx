import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';

const endpoints = [
  'Together Llama Guard 7B Assistant',
  'Together Llama3 8B Chat HF',
  'LLM Judge - OpenAI GPT4',
];
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
  const requiredEndpoints = cookbook.required_endpoints_in_cookbook;
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
      <header className="flex flex-basis-[100%] justify-between">
        <div className="flex gap-2 text-white">
          <Icon name={IconName.Book} />
          <h3 className="font-bold ">
            {cookbook.name.length > 40
              ? `${cookbook.name.substring(0, 40)}...`
              : cookbook.name}
          </h3>
          {cookbook.id == 'mlc-ai-safety' && (
            <Tooltip
              position={TooltipPosition.right}
              offsetLeft={10}
              content={
                <div className="p-4">
                  <h3 className="text-black font-bold mb-2">Requires</h3>
                  <ul className="text-gray-700">
                    {endpoints.map((endpoint) => (
                      <li key={endpoint}>{endpoint}</li>
                    ))}
                  </ul>
                </div>
              }>
              <Icon
                size={25}
                name={IconName.SolidBox}
                color={colors.moonpurplelight}
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Tooltip>
          )}
        </div>
        <input
          readOnly
          type="checkbox"
          aria-label={`Select ${cookbook.id}`}
          className="w-2 h-2 shrink-0"
          checked={isSelected}
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
