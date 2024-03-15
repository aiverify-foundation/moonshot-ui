import { useEffect, useState } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Window } from '@/app/components/window';
import { WindowList } from '@/app/components/window-list';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { AppEventTypes } from '@/app/types/enums';

type StatusPanelProps = {
  windowId: string;
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
    title,
    initialXY,
    initialSize,
    zIndex,
    onListItemClick,
    onCloseClick,
    onWindowChange,
  } = props;
  const [eventData, closeEventSource] = useEventSource<
    TestStatus,
    AppEventTypes
  >('/api/v1/stream', AppEventTypes.BENCHMARK_UPDATE);
  const {
    data = {},
    error,
    isLoading,
  } = useGetAllStatusQuery(undefined, { refetchOnMountOrArgChange: true });
  const [statuses, setStatuses] = useState<TestStatuses>({});
  const statusTuples = Object.entries(statuses);
  const windowTitle = title || 'Test Status';
  let countRunning = 0;
  let countCompleted = 0;

  statusTuples.forEach(([_, status]) => {
    if (status.curr_status === 'completed') {
      countCompleted++;
    } else {
      countRunning++;
    }
  });

  const footerText = `${countRunning} running, ${countCompleted} completed / ${statusTuples.length} total`;

  useEffect(() => {
    if (!statuses) return;
    if (eventData) {
      if (!eventData.exec_id) return;
      const id = eventData.exec_id;
      if (
        statuses[id] &&
        statuses[id].curr_progress == eventData.curr_progress &&
        statuses[id].curr_status == eventData.curr_status
      )
        return; // if the progress percentage and status is the same, don't update
      console.log(eventData);
      setStatuses((prev) => {
        return { ...prev, [id]: eventData };
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (!isLoading && data) {
      setStatuses(data);
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      console.debug('Unmount status. Closing event source');
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
      leftFooterText={footerText}
      footerHeight={30}
      contentAreaStyles={{
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
        {statusTuples.map(([id, status]) => (
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
                  />
                ) : (
                  <IconButton
                    label="Results"
                    labelSize={11}
                    iconSize={12}
                    iconName={IconName.Table}
                  />
                )}
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
