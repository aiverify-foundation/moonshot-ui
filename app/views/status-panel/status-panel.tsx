import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Window } from '@/app/components/window';
import { WindowList } from '@/app/components/window-list';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { useEffect, useState } from 'react';

type StatusPanelProps = {
  windowId: string;
  mini?: boolean;
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
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
    onListItemClick,
    onCloseClick,
    onWindowChange,
  } = props;
  const [eventData, closeEventSource] =
    useEventSource<TestStatus>('/api/v1/stream');
  const { data = {}, error, isLoading } = useGetAllStatusQuery();
  const [statuses, setStatuses] = useState<TestStatuses | undefined>();
  const windowTitle = title || 'Status Panel';

  useEffect(() => {
    console.log(eventData);
    if (!statuses) return;
    if (eventData) {
      const id = eventData.exec_id;
      if (statuses[id].curr_progress === eventData.curr_progress) return;
      setStatuses((prev) => {
        return { ...prev, [id]: eventData };
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (!isLoading && data) setStatuses(data);
  }, [isLoading]);

  useEffect(() => {
    return () => {
      console.debug('Status unmounted');
      closeEventSource();
    };
  }, []);

  return isLoading || !statuses ? null : (
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
      contentAreaStyles={{
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
        {Object.entries(statuses).map(([id, status]) => (
          <WindowList.Item
            key={id}
            id={id}
            className="justify-start">
            <div className="w-full flex flex-col">
              <div className="flex w-full justify-between mb-1">
                <h4 className="mb-1">{status.exec_name}</h4>
                {status.curr_status !== 'completed' ? (
                  <IconButton
                    label="Cancel"
                    labelSize={11}
                    iconSize={12}
                    iconName={IconName.Close}
                    onClick={() => {}}
                  />
                ) : null}
              </div>
              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 
                  text-center leading-none h-1 rounded-full"
                  style={{ width: `${status.curr_progress}%` }}
                />
              </div>
            </div>
          </WindowList.Item>
        ))}
      </WindowList>
    </Window>
  );
}

export { StatusPanel };
