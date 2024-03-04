import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBar } from '@/app/components/window-top-bar';

enum ButtonAction {
  VIEW,
  ADD,
  SELECT,
}

type TopButtonsBarProps = {
  onButtonClick: (action: ButtonAction) => void;
  activeButton?: ButtonAction;
};

function TopButtonsBar(props: TopButtonsBarProps) {
  const { onButtonClick, activeButton } = props;

  return (
    <WindowTopBar height={45}>
      <div className="flex flex-col justify-end h-full py-2">
        <div className="flex items-end gap-[2px]">
          <Tooltip
            position={TooltipPosition.top}
            offsetTop={-10}
            content="View Models">
            <IconButton
              disabled={activeButton === ButtonAction.VIEW}
              iconName={IconName.List}
              onClick={() => onButtonClick(ButtonAction.VIEW)}
              iconSize={11}
            />
          </Tooltip>
          <Tooltip
            position={TooltipPosition.top}
            offsetTop={-10}
            content="Create a new red teaming session">
            <IconButton
              disabled={activeButton === ButtonAction.ADD}
              iconName={IconName.Plus}
              label="Start New Session"
              onClick={() => onButtonClick(ButtonAction.ADD)}
              iconSize={11}
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBar>
  );
}

export { TopButtonsBar, ButtonAction };
