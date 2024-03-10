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
    <WindowTopBarButtonGroup height={30}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-end gap-1">
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="View Cookbook">
            <IconButton
              label="List Cookbooks"
              backgroundColor={
                activeButton === CookbooksExplorerButtonAction.VIEW_COOKBOOKS
                  ? '#425d85'
                  : 'transparent'
              }
              disabled={
                activeButton === CookbooksExplorerButtonAction.VIEW_COOKBOOKS
              }
              iconName={IconName.List}
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.VIEW_COOKBOOKS)
              }
              iconSize={11}
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.bottom}
            offsetTop={10}
            content="Add New Model">
            <IconButton
              label="Add New Model"
              backgroundColor={
                activeButton === CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK
                  ? '#425d85'
                  : 'transparent'
              }
              disabled={
                activeButton === CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK
              }
              iconName={IconName.Plus}
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK)
              }
              iconSize={11}
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Enable Cookbook selection for benchmarking or redteaming">
            <IconButton
              backgroundColor={
                activeButton === CookbooksExplorerButtonAction.SELECT_COOKBOOK
                  ? '#425d85'
                  : 'transparent'
              }
              disabled={
                activeButton === CookbooksExplorerButtonAction.SELECT_COOKBOOK
              }
              iconName={IconName.CheckedSquare}
              label="Select Cookbook for Testing"
              onClick={() =>
                onButtonClick(CookbooksExplorerButtonAction.SELECT_COOKBOOK)
              }
              iconSize={11}
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, CookbooksExplorerButtonAction };
