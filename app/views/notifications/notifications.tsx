'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useGetAllRunnersQuery } from '@/app/services/runner-api-service';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { AppEventTypes, TestStatusProgress } from '@/app/types/enums';
import { colors } from '@/app/views/shared-components/customColors';

function Notifications() {
  const [statuses, setStatuses] = React.useState<TestStatuses>({});
  const [showStatusPanel, setShowStatusPanel] = React.useState(false);
  const [iconState, setIconState] = React.useState<
    'hover' | 'press' | 'default'
  >('default');
  const [eventData, closeEventSource] = useEventSource<
    TestStatus,
    AppEventTypes
  >('/api/v1/stream', AppEventTypes.BENCHMARK_UPDATE);
  const { data: allTestStatus = {} } = useGetAllStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const runnerIds = Object.keys(allTestStatus) || [];
  const { data: runners = [] } = useGetAllRunnersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const statusNotificationsRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => closeEventSource();
  }, []);

  useEffect(() => {
    if (!eventData) return;
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      ...{ [eventData.current_runner_id]: eventData },
    }));
  }, [eventData]);

  useEffect(() => {
    setStatuses(allTestStatus);
  }, [allTestStatus]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        statusNotificationsRef.current &&
        !statusNotificationsRef.current.contains(event.target as Node)
      ) {
        setShowStatusPanel(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showStatusPanel]);

  function handleIconClick() {
    setShowStatusPanel(!showStatusPanel);
  }

  let iconColor = colors.moongray[300];
  if (iconState === 'hover') {
    iconColor = colors.moongray[400];
  }
  if (iconState === 'press') {
    iconColor = colors.moongray[500];
  }

  return (
    <div
      className="relative"
      ref={statusNotificationsRef}>
      <section
        onClick={handleIconClick}
        onMouseOver={() => setIconState('hover')}
        onMouseDown={() => setIconState('press')}
        onMouseUp={() => setIconState('hover')}
        onMouseLeave={() => setIconState('default')}>
        <Icon
          color={iconColor}
          name={IconName.Bell}
          size={30}
          style={{ cursor: 'pointer' }}
        />
      </section>
      {showStatusPanel && (
        <section
          className="absolute border-[1px] border-moongray-800 bg-moongray-950
          rounded-md shadow-lg z-[999] right-0 top-[40px]">
          <h3 className="text-white p-2 text-[0.9rem] bg-moongray-1000 rounded-t-md">
            Benchmark Run Status
          </h3>
          <div className="overflow-x-hidden overflow-y-auto custom-scrollbar max-h-[420px] min-h-[200px]">
            <ul className="flex flex-col w-[240px] divide-y divide-moongray-800">
              {runnerIds.map((runnerId) => {
                const runner = runners.find((runner) => runner.id === runnerId);
                return (
                  <Link
                    href={`/benchmarking/session/run?runner_id=${runnerId}`}
                    key={runnerId}>
                    <li
                      key={runnerId}
                      className="px-3 py-[14px] text-white font-thin text-[0.8rem] cursor-pointer hover:bg-moongray-800
                  active:bg-moongray-1000"
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}>
                      <p className="flex justify-between tracking-wider">
                        <span>{runner ? runner.name : runnerId}</span>
                        <span>{statuses[runnerId].current_status}</span>
                      </p>
                      <div
                        className={`${
                          statuses[runnerId].current_status ==
                          TestStatusProgress.ERRORS
                            ? 'bg-red-700'
                            : statuses[runnerId].current_status ==
                                TestStatusProgress.CANCELLED
                              ? 'bg-moonwine-400'
                              : 'bg-blue-600'
                        } leading-none h-1 rounded-full`}
                        style={{
                          width: `${statuses[runnerId].current_progress}%`,
                          animation:
                            statuses[runnerId].current_status ==
                            TestStatusProgress.RUNNING
                              ? 'pulse 1.5s infinite ease-out'
                              : 'none',
                        }}
                      />
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default Notifications;
