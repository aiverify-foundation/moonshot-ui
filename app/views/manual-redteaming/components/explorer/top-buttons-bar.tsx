import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum SessionExplorerButtonAction {
  VIEW,
  ADD,
}

type TopButtonsBarProps = {
  onButtonClick: (action: SessionExplorerButtonAction) => void;
  activeButton?: SessionExplorerButtonAction;
};

function TopButtonsBar(props: TopButtonsBarProps) {
  const { onButtonClick, activeButton } = props;

  return (
    <WindowTopBarButtonGroup height={30}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-end gap-1">
          <div>
            <Tooltip
              delay={100}
              position={TooltipPosition.top}
              offsetTop={-10}
              content="View Existing Sessions">
              <IconButton
                backgroundColor={
                  activeButton === SessionExplorerButtonAction.VIEW
                    ? '#425d85'
                    : 'transparent'
                }
                label="List Sessions"
                disabled={activeButton === SessionExplorerButtonAction.VIEW}
                iconName={IconName.List}
                onClick={() => onButtonClick(SessionExplorerButtonAction.VIEW)}
                iconSize={11}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip
              delay={100}
              position={TooltipPosition.bottom}
              offsetTop={10}
              content="Start a new red teaming session">
              <IconButton
                backgroundColor={
                  activeButton === SessionExplorerButtonAction.ADD
                    ? '#425d85'
                    : 'transparent'
                }
                disabled={activeButton === SessionExplorerButtonAction.ADD}
                iconName={IconName.Plus}
                label="New Session"
                onClick={() => onButtonClick(SessionExplorerButtonAction.ADD)}
                iconSize={11}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, SessionExplorerButtonAction };
