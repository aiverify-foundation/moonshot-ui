import React from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';
import { cn } from '@/app/lib/cn';
import { ViewBookmarksModal } from './viewBookmarksModal';

function BookmarksPanel({
  bottom,
  left,
  disabled,
  defaultShowPanel = false,
  className,
  onUseBtnClick,
  onPanelClose,
}: {
  bottom?: React.CSSProperties['top'];
  left?: React.CSSProperties['left'];
  disabled: boolean;
  defaultShowPanel?: boolean;
  className?: string;
  onPanelClose?: () => void;
  onUseBtnClick: (preparedPrompt: string) => void;
}) {
  const [showPanel, setShowPanel] = React.useState(() => defaultShowPanel);

  React.useEffect(() => {
    setShowPanel(defaultShowPanel);
  }, [defaultShowPanel]);

  function handleUseBtnClick(preparedPrompt: string) {
    onUseBtnClick(preparedPrompt);
    setShowPanel(false);
    if (onPanelClose) {
      onPanelClose();
    }
  }

  function handleCancelBtnClick() {
    setShowPanel(false);
    if (onPanelClose) {
      onPanelClose();
    }
  }

  return (
    <div
      className={cn(
        'bg-moongray-600 w-[220px] absolute rounded-md p-2 shadow-lgflex gap-4',
        className
      )}
      style={{ bottom, left }}>
      {disabled && (
        <div
          className="absolute gap-2 bg-moongray-950/50 w-full h-full z-10
            flex justify-center items-center rounded-md"
          style={{ top: 0, left: 0 }}>
          <div className="waitspinner" />
        </div>
      )}
      {showPanel && (
        <ViewBookmarksModal
          onCloseIconClick={handleCancelBtnClick}
          onPrimaryBtnClick={handleUseBtnClick}
        />
      )}
      <div className="flex items-center gap-2">
        <Button
          width={200}
          alignContent="flex-start"
          text="Bookmarked Prompts"
          type="button"
          mode={ButtonType.TEXT}
          hoverBtnColor={colors.moongray[500]}
          pressedBtnColor={colors.moongray[400]}
          leftIconName={IconName.Ribbon}
          onClick={() => setShowPanel(true)}
        />
      </div>
    </div>
  );
}

export { BookmarksPanel };
