import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum ModelsExplorerButtonAction {
  VIEW_MODELS,
  ADD_NEW_MODEL,
  SELECT_MODELS,
}

type TopButtonsBarProps = {
  onButtonClick: (action: ModelsExplorerButtonAction) => void;
  activeButton?: ModelsExplorerButtonAction;
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
            content="View Models">
            <IconButton
              label="List Models"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === ModelsExplorerButtonAction.VIEW_MODELS
                  ? '#425d85'
                  : ''
              }
              disabled={activeButton === ModelsExplorerButtonAction.VIEW_MODELS}
              iconName={IconName.List}
              onClick={() =>
                onButtonClick(ModelsExplorerButtonAction.VIEW_MODELS)
              }
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.bottom}
            offsetTop={10}
            content="Add New Model">
            <IconButton
              label="Add New Model"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === ModelsExplorerButtonAction.ADD_NEW_MODEL
                  ? '#425d85'
                  : ''
              }
              disabled={
                activeButton === ModelsExplorerButtonAction.ADD_NEW_MODEL
              }
              iconName={IconName.Plus}
              onClick={() =>
                onButtonClick(ModelsExplorerButtonAction.ADD_NEW_MODEL)
              }
            />
          </Tooltip>
          <Tooltip
            delay={100}
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Enable models selection for benchmarking or redteaming">
            <IconButton
              label="Select Models for Testing"
              labelSize={14}
              iconSize={14}
              className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
              activeColor={
                activeButton === ModelsExplorerButtonAction.SELECT_MODELS
                  ? '#425d85'
                  : ''
              }
              disabled={
                activeButton === ModelsExplorerButtonAction.SELECT_MODELS
              }
              iconName={IconName.CheckedSquare}
              onClick={() =>
                onButtonClick(ModelsExplorerButtonAction.SELECT_MODELS)
              }
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, ModelsExplorerButtonAction };
