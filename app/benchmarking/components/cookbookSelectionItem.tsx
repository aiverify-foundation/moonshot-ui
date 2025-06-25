import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { Checkbox } from '@/app/components/checkbox';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';

type CookbookSelectionItemProps = {
  cookbook: Cookbook;
  selected: boolean;
  onSelect: (cookbook: Cookbook) => void;
  onAboutClick: (cookbook: Cookbook) => void;
};

function CookbookSelectionItem(props: CookbookSelectionItemProps) {
  const { cookbook, selected, onSelect, onAboutClick } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const requiredEndpoints = getEndpointsFromRequiredConfig(
    cookbook.required_config
  );

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
      className="flex flex-col gap-2 border rounded-xl p-6 cursor-pointer border-moongray-800
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
      <section className="flex flex-col justify-between gap-2 h-full">
        <div>
          <header className="flex flex-basis-[100%] justify-between gap-2">
            <div className="flex gap-2 text-white items-start">
              <Icon
                name={IconName.Book}
                style={{ marginTop: 2 }}
              />
              <h3 className="font-semibold text-[1rem] tracking-wide">
                {cookbook.name}
              </h3>
            </div>
            <Checkbox
              label=""
              size="s"
              ariaLabel={`Select ${cookbook.id}`}
              checked={isSelected}
              onChange={() => handleClick}
            />
          </header>
          <div className="flex flex-wrap gap-2 mb-4 mt-6">
            {cookbook.tags?.map((tagName) => (
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
          <p className="break-all break-words text-moongray-400">
            {cookbook.description}
          </p>
          {requiredEndpoints && requiredEndpoints.length > 0 ? (
            <div className="flex items-center gap-2 mt-4">
              <p className="text-moongray-400 font-bold ">
                Additional Requirements
              </p>
              <Tooltip
                position={TooltipPosition.right}
                offsetLeft={10}
                content={
                  <div className="p-1 pt-0">
                    <h3 className="text-black font-bold mb-2">Requires connection to the following evaluator model(s) to help score the tests</h3>
                    <ul className="text-gray-700">
                      {requiredEndpoints.map((endpoint) => (
                        <li key={endpoint}>{endpoint}</li>
                      ))}
                    </ul>
                  </div>
                }>
                <Icon
                  name={IconName.Alert}
                  color={colors.moonpurplelight}
                />
              </Tooltip>
            </div>
          ) : null}
        </div>
        <footer className="flex justify-between mt-4 text-moongray-400 items-end">
          <div className="flex flex-col">
            <p>{cookbook.total_prompt_in_cookbook} prompts</p>
            <p>
              {cookbook.total_dataset_in_cookbook}&nbsp;
              {cookbook.total_dataset_in_cookbook > 1 ? 'Datasets' : 'Dataset'}
            </p>
          </div>
          <span
            className="decoration-1 underline cursor-pointer hover:text-moonwine-500 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onAboutClick(cookbook);
            }}>
            About
          </span>
        </footer>
      </section>
    </li>
  );
}

export { CookbookSelectionItem };
