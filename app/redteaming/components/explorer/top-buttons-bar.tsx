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
    <WindowTopBarButtonGroup height={38}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-end gap-1">
          <div>
            <Tooltip
              delay={100}
              position={TooltipPosition.top}
              offsetTop={-10}
              content="View Existing Sessions">
              <IconButton
                labelSize={14}
                iconSize={14}
                className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
                activeColor={
                  activeButton === SessionExplorerButtonAction.VIEW
                    ? '#425d85'
                    : ''
                }
                label="List Sessions"
                iconName={IconName.List}
                onClick={() => onButtonClick(SessionExplorerButtonAction.VIEW)}
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
                labelSize={14}
                iconSize={14}
                className="bg-transparent hover:bg-fuchsia-900/40 transition-colors duration-100 ease-in"
                activeColor={
                  activeButton === SessionExplorerButtonAction.ADD
                    ? '#425d85'
                    : ''
                }
                iconName={IconName.Plus}
                label="New Session"
                onClick={() => onButtonClick(SessionExplorerButtonAction.ADD)}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, SessionExplorerButtonAction };
