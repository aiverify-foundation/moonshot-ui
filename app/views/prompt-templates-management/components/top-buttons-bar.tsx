import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';

enum PromptTemplatesExplorerButtonAction {
  VIEW_TEMPLATES,
}

type TopButtonsBarProps = {
  onButtonClick: (action: PromptTemplatesExplorerButtonAction) => void;
  activeButton?: PromptTemplatesExplorerButtonAction;
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
            content="View All Prompt Templates">
            <IconButton
              label="List Prompt Templates"
              labelSize={14}
              iconSize={14}
              activeColor={
                activeButton ===
                PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES
                  ? '#425d85'
                  : 'transparent'
              }
              disabled={
                activeButton ===
                PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES
              }
              iconName={IconName.List}
              onClick={() =>
                onButtonClick(
                  PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES
                )
              }
            />
          </Tooltip>
        </div>
      </div>
    </WindowTopBarButtonGroup>
  );
}

export { TopButtonsBar, PromptTemplatesExplorerButtonAction };
