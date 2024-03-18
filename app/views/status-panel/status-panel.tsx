import { useEffect, useState } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { Window } from '@/app/components/window';
import { WindowList } from '@/app/components/window-list';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { getWindowId } from '@/app/lib/window-utils';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { AppEventTypes, TestStatusProgress } from '@/app/types/enums';
import { WindowIds } from '@/app/views/moonshot-desktop/constants';
import {
  addOpenedWindowId,
  setActiveResult,
  updateFocusedWindowId,
  useAppDispatch,
} from '@/lib/redux';

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

  const dispatch = useAppDispatch();

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

  function handleResultsClick(execId: string) {
    return () => {
      dispatch(setActiveResult(execId));
      dispatch(updateFocusedWindowId(getWindowId(WindowIds.RESULT)));
      dispatch(addOpenedWindowId(getWindowId(WindowIds.RESULT)));
    };
  }

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
      leftFooterText={footerText}
      footerHeight={30}
      contentAreaStyles={{
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      {isLoading ? (
        <div className="ring">
          Loading
          <span />
        </div>
      ) : (
        <>
          <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
            {statusTuples.map(([id, status]) => (
              <WindowList.Item
                key={id}
                id={id}
                className="justify-start">
                <div className="w-full flex flex-col">
                  <div className="flex w-full justify-between my-2">
                    <h4 className="mb-1">{status.exec_name}</h4>
                    {status.curr_status == TestStatusProgress.RUNNING ? (
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
                        onClick={handleResultsClick(status.exec_id)}
                      />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className={`${
                        status.curr_status == TestStatusProgress.ERRORS
                          ? 'bg-red-700'
                          : 'bg-blue-600'
                      } leading-none h-1 rounded-full`}
                      style={{
                        width: `${Math.max(status.curr_progress, 10)}%`,
                        animation:
                          status.curr_status == TestStatusProgress.RUNNING
                            ? 'pulse 1.5s infinite ease-out'
                            : 'none',
                      }}
                    />
                  </div>
                </div>
              </WindowList.Item>
            ))}
          </WindowList>
        </>
      )}
    </Window>
  );
}

export { StatusPanel };
