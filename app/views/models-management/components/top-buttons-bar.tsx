import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum ButtonAction {
  VIEW_MODELS,
  ADD_NEW_MODEL,
  SELECT_MODELS,
}

type TopButtonsBarProps = {
  onButtonClick: (action: ButtonAction) => void;
  activeButton?: ButtonAction;
};

function TopButtonsBar(props: TopButtonsBarProps) {
  const { onButtonClick, activeButton } = props;

  return (
    <WindowTopBarButtonGroup height={45}>
      <div className="flex flex-col justify-end h-full py-2">
        <div className="flex items-end gap-[2px]">
          <Tooltip
            position={TooltipPosition.top}
            offsetTop={-10}
            content="View Models">
            <IconButton
              disabled={activeButton === ButtonAction.VIEW_MODELS}
              iconName={IconName.List}
              onClick={() => onButtonClick(ButtonAction.VIEW_MODELS)}
              iconSize={11}
            />
          </Tooltip>
          <Tooltip
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Add New Model">
            <IconButton
              disabled={activeButton === ButtonAction.ADD_NEW_MODEL}
              iconName={IconName.Plus}
              onClick={() => onButtonClick(ButtonAction.ADD_NEW_MODEL)}
              iconSize={11}
            />
          </Tooltip>
          <Tooltip
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Enable models selection for benchmarking or redteaming">
            <IconButton
              disabled={activeButton === ButtonAction.SELECT_MODELS}
              iconName={IconName.CheckedSquare}
              label="Select Models for Testing"
              onClick={() => onButtonClick(ButtonAction.SELECT_MODELS)}
              iconSize={11}
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, ButtonAction };
