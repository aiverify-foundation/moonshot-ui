'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import { Button, ButtonType } from '@/app/components/button';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { AppEventTypes, TestStatusProgress } from '@/app/types/enums';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

function BenchmarkRunStatus() {
  const [showRunDetails, setShowRunDetails] = React.useState(true);
  const [statuses, setStatuses] = React.useState<TestStatuses | undefined>();
  const [eventData, closeEventSource] = useEventSource<
    TestStatus,
    AppEventTypes
  >('/api/v1/stream', AppEventTypes.BENCHMARK_UPDATE);
  const {
    data = {},
    error,
    isLoading,
  } = useGetAllStatusQuery(undefined, { refetchOnMountOrArgChange: true });
  const router = useRouter();
  const searchParams = useSearchParams();
  const runner_id = searchParams.get('runner_id');

  React.useEffect(() => {
    if (!statuses) return;
    if (eventData) {
      if (!eventData.current_runner_id) return;
      const id = eventData.current_runner_id;
      if (
        statuses[id] &&
        statuses[id].current_progress == eventData.current_progress &&
        statuses[id].current_status == eventData.current_status
      )
        return; // if the progress percentage and status is the same, don't update
      console.log(eventData);
      setStatuses((prev) => {
        return { ...prev, [id]: eventData };
      });
    }
  }, [eventData]);

  React.useEffect(() => {
    if (!isLoading && data) {
      setStatuses(data);
    }
  }, [isLoading]);

  React.useEffect(() => {
    return () => {
      console.debug('Unmount status. Closing event source');
      closeEventSource();
    };
  }, []);

  React.useEffect(() => {
    if (!statuses || !runner_id) return;
    console.dir(statuses[runner_id]);
  }, [statuses, runner_id]);

  return (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/benchmarking')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="flex flex-col items-center h-full gap-4">
        <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
          Running Tests...
        </h2>

        <Button
          mode={ButtonType.OUTLINE}
          size="md"
          type="button"
          text="See Details"
          onClick={() => setShowRunDetails(!showRunDetails)}
        />

        <section className="relative flex w-full justify-center mb-5">
          {isLoading ? (
            <div className="ring">
              Loading
              <span />
            </div>
          ) : (
            statuses &&
            runner_id && (
              <div className="w-full flex flex-col items-center gap-2 mt-5">
                <p className="text-white text-[0.9rem] w-[90%]">
                  Test recommeded set for chatbot
                </p>
                <div className="w-[90%] h-[140px] items-center flex gap-4 border border-moongray-700 px-4 rounded-lg">
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-white text-[1.1rem] w-[90%]">
                      {Math.max(statuses[runner_id].current_progress, 10)}%
                    </p>
                    <div
                      className={`${
                        statuses[runner_id].current_status ==
                        TestStatusProgress.ERRORS
                          ? 'bg-red-700'
                          : 'bg-blue-600'
                      } leading-none h-1 rounded-full`}
                      style={{
                        width: `${Math.max(statuses[runner_id].current_progress, 10)}%`,
                        animation:
                          statuses[runner_id].current_status ==
                          TestStatusProgress.RUNNING
                            ? 'pulse 1.5s infinite ease-out'
                            : 'none',
                      }}
                    />
                  </div>
                  <Button
                    mode={ButtonType.OUTLINE}
                    size="lg"
                    type="button"
                    text="Cancel"
                    onClick={() => null}
                  />
                </div>
              </div>
            )
          )}
        </section>

        <section className="w-full flex flex-col gap-2 items-center">
          <div className="w-[90%] flex flex-col gap-3">
            <p className="text-white text-[1.1rem]">
              While waiting for these to run, you can
            </p>
            <div className="col-span-3 grid grid-cols-3 gap-[1.7%] w-[90%]">
              <ActionCard
                height={240}
                iconSize={35}
                cardColor={colors.moongray[800]}
                title="Discover"
                description="new vulnerabilities"
                descriptionColor={colors.moongray[300]}
                iconName={IconName.Spacesuit}
                actionText="Start Red Teaming"
              />
              <ActionCard
                height={240}
                iconSize={35}
                title="Create"
                description="custom tests"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[800]}
                iconName={IconName.Lightning}
                actionText="Upload Datasets"
              />
              <div className="flex flex-col gap-2 justify-center">
                <Button
                  rightIconName={IconName.ArrowRight}
                  mode={ButtonType.LINK}
                  size="md"
                  type="button"
                  text="Back to home"
                  onClick={() => router.push('/')}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkRunStatus };
