import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum CookbooksExplorerButtonAction {
  VIEW_COOKBOOKS,
  ADD_NEW_COOKBOOK,
  SELECT_COOKBOOK,
}

type TopButtonsBarProps = {
  onButtonClick: (action: CookbooksExplorerButtonAction) => void;
  activeButton?: CookbooksExplorerButtonAction;
};

function TopButtonsBar(props: TopButtonsBarProps) {
  const { onButtonClick, activeButton } = props;

  return (
    <WindowTopBarButtonGroup height={38}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-end gap-4">
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="View Cookbook">
            <IconButton
              label="List Cookbooks"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === CookbooksExplorerButtonAction.VIEW_COOKBOOKS
                  ? '#425d85'
                  : ''
              }
              iconName={IconName.List}
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.VIEW_COOKBOOKS)
              }
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.bottom}
            offsetTop={10}
            content="Add New Cookbook">
            <IconButton
              label="Add New Cookbook"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK
                  ? '#425d85'
                  : ''
              }
              iconName={IconName.Plus}
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK)
              }
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Enable Cookbook selection for benchmarking or redteaming">
            <IconButton
              label="Select Cookbook for Testing"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === CookbooksExplorerButtonAction.SELECT_COOKBOOK
                  ? '#425d85'
                  : ''
              }
              disabled={
                activeButton === CookbooksExplorerButtonAction.SELECT_COOKBOOK
              }
              iconName={IconName.CheckedSquare}
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.SELECT_COOKBOOK)
              }
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, CookbooksExplorerButtonAction };
