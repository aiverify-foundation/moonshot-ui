'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import { Button, ButtonType } from '@/app/components/button';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useCancelBenchmarkMutation } from '@/app/services/benchmark-api-service';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { useGetLLMEndpointsQuery } from '@/app/services/llm-endpoint-api-service';
import { useGetRunnerByIdQuery } from '@/app/services/runner-api-service';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { AppEventTypes, TestStatusProgress } from '@/app/types/enums';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { PopupSurface } from '@/app/views/shared-components/popupSurface/popupSurface';

function BenchmarkRunStatus() {
  const [showRunDetails, setShowRunDetails] = React.useState(false);
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
  const [triggerCancelBenchmark] = useCancelBenchmarkMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const runner_id = searchParams.get('runner_id');
  const { data: runnerData, isLoading: runnerDataIsLoading } =
    useGetRunnerByIdQuery(
      { id: runner_id, additionalDetails: true },
      { skip: !runner_id }
    );
  const { data: endpointsData, isLoading: endpointsDataIsLoading } =
    useGetLLMEndpointsQuery(undefined, { skip: !runnerData });
  const { data: cookbooksData, isLoading: cookbooksDataIsLoading } =
    useGetCookbooksQuery(
      {
        ids:
          runnerData && runnerData.runner_args
            ? runnerData.runner_args.cookbooks
            : [],
      },
      { skip: !runnerData }
    );

  const endpoints =
    endpointsData &&
    endpointsData.filter(
      (ep) =>
        runnerData &&
        runnerData.endpoints &&
        runnerData.endpoints.includes(ep.id)
    );
  const cookbooks = cookbooksData && cookbooksData;

  let headingText = '';
  if (statuses && runner_id !== null && statuses[runner_id]) {
    if (statuses[runner_id].current_status == TestStatusProgress.RUNNING) {
      headingText = 'Running Tests...';
    }
    if (statuses[runner_id].current_status == TestStatusProgress.COMPLETED) {
      headingText = 'Tests Completed';
    }
    if (statuses[runner_id].current_status == TestStatusProgress.CANCELLED) {
      headingText = 'Tests Cancelled';
    }
  }

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

  const progressBox = statuses && runner_id && statuses[runner_id] && (
    <div className="w-full flex flex-col items-center gap-2 mt-5">
      {!showRunDetails && (
        <p className="text-white text-[0.9rem] w-[90%] pl-4">
          {runnerData && runnerData.name}
        </p>
      )}
      <div
        className="w-[90%] h-[140px] items-center flex gap-4
        border border-moongray-700 px-8 rounded-[20px]">
        <div className="w-full flex flex-col gap-2">
          <p className="text-white text-[1.1rem] w-[90%]">
            {statuses[runner_id].current_status == TestStatusProgress.CANCELLED
              ? 'Cancelled'
              : `${Math.max(statuses[runner_id].current_progress, 10)}%`}
          </p>
          <div
            className={`${
              statuses[runner_id].current_status == TestStatusProgress.ERRORS
                ? 'bg-red-700'
                : statuses[runner_id].current_status ==
                    TestStatusProgress.CANCELLED
                  ? 'bg-moonwine-400'
                  : 'bg-blue-600'
            } leading-none h-2 rounded-full`}
            style={{
              width: `${Math.max(statuses[runner_id].current_progress, 10)}%`,
              animation:
                statuses[runner_id].current_status == TestStatusProgress.RUNNING
                  ? 'pulse 1.5s infinite ease-out'
                  : 'none',
            }}
          />
        </div>
        {statuses[runner_id].current_status === TestStatusProgress.RUNNING && (
          <Button
            mode={ButtonType.OUTLINE}
            size="lg"
            type="button"
            hoverBtnColor={colors.moongray[700]}
            pressedBtnColor={colors.moongray[900]}
            text="Cancel"
            onClick={() => triggerCancelBenchmark(runner_id)}
          />
        )}
        {statuses[runner_id].current_status ===
          TestStatusProgress.COMPLETED && (
          <Link href={`/benchmarking/report?id=${runner_id}`}>
            <Button
              width={150}
              mode={ButtonType.OUTLINE}
              size="lg"
              type="button"
              hoverBtnColor={colors.moongray[700]}
              pressedBtnColor={colors.moongray[900]}
              text="View Report"
            />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/benchmarking')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="flex flex-col items-center h-full gap-4">
        {showRunDetails && runnerData ? (
          <PopupSurface
            style={{
              backgroundColor: colors.moongray['900'],
              border: 'none',
            }}
            height="100%"
            padding="10px"
            onCloseIconClick={() => setShowRunDetails(false)}>
            <div className="px-10 py-8 h-full">
              <header className="text-white">
                <h1 className="text-[2rem] font-thin mb-2 ">Run Details</h1>
                <div className="flex flex-col gap-2 items-center">
                  <p>
                    <span className="text-moonwine-400 pr-2">Name:</span>
                    {runnerData.name}
                  </p>
                  <p>
                    <span className="text-moonwine-400 pr-2">Description:</span>
                    {runnerData.description}
                  </p>
                  <p>
                    <span className="text-moonwine-400 pr-2">
                      Number of prompts to run:
                    </span>
                    {runnerData.runner_args &&
                      runnerData.runner_args.num_of_prompts}
                  </p>
                </div>
              </header>
              {progressBox}
              <div className="overflow-x-hidden overflow-y-auto custom-scrollbar px-8">
                <section className="pt-6 w-full h-full px-8 mb-5">
                  <p className="text-moonwine-400">SUTs</p>
                  <div className="grid grid-cols-2 gap-10 w-full">
                    {endpoints &&
                      endpoints.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex flex-col gap-2 border border-moonwine-600
                          rounded-[15px] p-5 text-white">
                          <div className="flex flex-row gap-2">
                            <Icon
                              name={IconName.OutlineBox}
                              size={20}
                            />
                            <p className="text-[1.2rem]">{ep.name}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                <section className="pt-6 w-full h-full px-8">
                  <p className="text-moonwine-400 pb-2">Cookbooks</p>
                  <div className="grid grid-cols-2 gap-10 w-full">
                    {cookbooks &&
                      cookbooks.map((cb) => (
                        <div
                          key={cb.id}
                          className="flex flex-col gap-2 border border-moonwine-600
                          rounded-[15px] p-5 text-white">
                          <div className="flex flex-row gap-2">
                            <Icon
                              name={IconName.OutlineBox}
                              size={20}
                            />
                            <p className="text-[1.2rem]">{cb.name}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>
          </PopupSurface>
        ) : !isLoading ? (
          <>
            <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
              {headingText}
            </h2>
            <Button
              mode={ButtonType.OUTLINE}
              hoverBtnColor={colors.moongray[700]}
              pressedBtnColor={colors.moongray[900]}
              size="md"
              type="button"
              text="See Details"
              onClick={() => setShowRunDetails(!showRunDetails)}
            />

            <section className="relative flex w-full justify-center mb-5">
              {progressBox}
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
          </>
        ) : (
          <div className="relative h-full">
            <div className="ring">
              Loading
              <span />
            </div>
          </div>
        )}
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkRunStatus };
