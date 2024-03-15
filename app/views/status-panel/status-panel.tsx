import { Window } from '@/app/components/window';
import { WindowList } from '@/app/components/window-list';
import { useEffect, useState } from 'react';

type StatusPanelProps = {
  windowId: string;
  mini?: boolean;
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  statusCollection: TestStatuses;
  onListItemClick?: (recipe: Recipe) => void;
  onCloseClick: () => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

function StatusPanel(props: StatusPanelProps) {
  const {
    windowId,
    mini = true,
    title,
    initialXY,
    initialSize,
    zIndex,
    statusCollection,
    onListItemClick,
    onCloseClick,
    onWindowChange,
  } = props;
  const [statuses, setStatuses] = useState<TestStatuses>({});
  const windowTitle = title || 'Status Panel';

  useEffect(() => {
    setStatuses(statusCollection);
  }, [statusCollection]);
  return (
    <Window
      id={windowId}
      resizeable={true}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      name={windowTitle}
      leftFooterText={'todo'}
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}>
      <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
        {Object.entries(statuses).map(([id, status]) => (
          <WindowList.Item
            key={id}
            id={id}
            className="justify-start">
            <div>
              <h4>{status.exec_name}</h4>
              <p>{status.curr_progress}</p>
            </div>
          </WindowList.Item>
        ))}
      </WindowList>
    </Window>
  );
}

export { StatusPanel };
