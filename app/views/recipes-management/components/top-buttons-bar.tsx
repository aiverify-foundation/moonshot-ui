import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum RecipesExplorerButtonAction {
  VIEW_RECIPES,
  ADD_NEW_RECIPE,
  SELECT_RECIPES,
}

type TopButtonsBarProps = {
  onButtonClick: (action: RecipesExplorerButtonAction) => void;
  activeButton?: RecipesExplorerButtonAction;
};

function TopButtonsBar(props: TopButtonsBarProps) {
  const { onButtonClick, activeButton } = props;

  return (
    <WindowTopBarButtonGroup height={38}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-end gap-1">
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="View All Recipes">
            <IconButton
              label="List Recipes"
              labelSize={14}
              iconSize={14}
              activeColor={
                activeButton === RecipesExplorerButtonAction.VIEW_RECIPES
                  ? '#425d85'
                  : 'transparent'
              }
              iconName={IconName.List}
              onClick={() =>
                onButtonClick(RecipesExplorerButtonAction.VIEW_RECIPES)
              }
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.bottom}
            offsetTop={10}
            content="Add New Recipe">
            <IconButton
              label="Add New Recipe"
              labelSize={14}
              iconName={IconName.Plus}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === RecipesExplorerButtonAction.ADD_NEW_RECIPE
                  ? '#425d85'
                  : ''
              }
              onClick={() =>
                onButtonClick(RecipesExplorerButtonAction.ADD_NEW_RECIPE)
              }
            />
          </Tooltip>
          {/* <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Enable Recipe selection for benchmarking">
            <IconButton
              labelSize={14}
              iconSize={14}
              activeColor={
                activeButton === RecipesExplorerButtonAction.SELECT_RECIPES
                  ? '#425d85'
                  : 'transparent'
              }
              iconName={IconName.CheckedSquare}
              label="Select Recipes for Testing"
              onClick={() =>
                onButtonClick(RecipesExplorerButtonAction.SELECT_RECIPES)
              }
            />
          </Tooltip> */}
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, RecipesExplorerButtonAction };
