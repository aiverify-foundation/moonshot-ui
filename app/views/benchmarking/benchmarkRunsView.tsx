'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { CSSProperties } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { formatDateFromTimestamp } from '@/app/lib/date-utils';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

interface CustomStyle extends CSSProperties {
  webkitLineClamp?: string;
  webkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  webkitLineClamp: '2',
  webkitBoxOrient: 'vertical',
};

function BenchmarkRunsView({
  runners,
  resultIds,
}: {
  runners: Runner[];
  resultIds: string[];
}) {
  const searchParams = useSearchParams();
  const [selectedRunner, setSelectedRunner] = React.useState<Runner>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return runners[0];
    }
    return runners.find((runner) => runner.id === id) || runners[0];
  });

  if (runners.length === 0) {
    throw new Error('No past runs found', { cause: 'NO_RUNNERS_FOUND' });
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 mb-3 justify-between items-end w-full">
          <h1 className="text-[1.6rem] text-white mt-3">Past Benchmark Runs</h1>
          <Link href="/benchmarking/session/new">
            <Button
              size="md"
              mode={ButtonType.OUTLINE}
              leftIconName={IconName.Plus}
              text="Start New Run"
              hoverBtnColor={colors.moongray[800]}
            />
          </Link>
        </header>
        <main
          className="grid grid-cols-2 gap-5"
          style={{ height: 'calc(100% - 140px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {runners.map((runner) => {
              const isSelected = runner.id === selectedRunner.id;
              return (
                <li
                  key={runner.id}
                  className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedRunner(runner)}>
                  <div className="flex gap-2 mb-2">
                    <Icon name={IconName.HistoryClock} />
                    <h4 className="text-[1rem] font-semibold">{runner.name}</h4>
                  </div>
                  <p
                    className="text-[0.8rem] h-[40px] overflow-hidden text-ellipsis text-moongray-400"
                    style={ellipsisStyle}>
                    {runner.description}
                  </p>
                  {runner.start_time && (
                    <p className="text-[0.8rem] text-moongray-300 text-right">
                      Started on {formatDateFromTimestamp(runner.start_time)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
            <div className="flex gap-2 mb-4">
              <Icon
                name={IconName.HistoryClock}
                size={24}
              />
              <h3 className="text-[1.2rem] font-semibold">
                {selectedRunner.name}
              </h3>
            </div>
            <p className="text-[0.95rem] text-moongray-300">
              {selectedRunner.description}
            </p>
            <h4 className="text-[1.15rem] font-semibold mt-10 mb-1">
              Model Endpoints
            </h4>
            <p className="text-[0.95rem] text-moongray-300">
              {selectedRunner.endpoints.map((endpoint, idx, endpoints) => {
                return (
                  <span key={endpoint}>
                    {endpoint}
                    {idx === endpoints.length - 1 ? '' : `,`}
                    &nbsp;
                  </span>
                );
              })}
            </p>
            <h4 className="text-[1.15rem] font-semibold mt-10 mb-1">
              Cookbooks
            </h4>
            <p className="text-[0.95rem] text-moongray-300">
              {selectedRunner.runner_args &&
                selectedRunner.runner_args.cookbooks.map(
                  (cookbook, idx, cookbooks) => {
                    return (
                      <span key={cookbook}>
                        {cookbook}
                        {idx === cookbooks.length - 1 ? '' : `,`}
                        &nbsp;
                      </span>
                    );
                  }
                )}
            </p>

            <h4 className="text-[1.15rem] font-semibold mt-10 mb-1">
              Prompts sent per Endpoint
            </h4>
            <p className="text-[0.95rem] text-moongray-300">
              {selectedRunner.runner_args &&
                selectedRunner.runner_args.num_of_prompts}
            </p>

            {selectedRunner.start_time && (
              <p className="text-[1rem] text-moongray-300 text-right pt-10">
                Started on {formatDateFromTimestamp(selectedRunner.start_time)}
              </p>
            )}
          </section>
        </main>
        <footer className="absolute bottom-0 w-full flex justify-end gap-4">
          {resultIds.includes(selectedRunner.id) && (
            <Link href={`/benchmarking/report?id=${selectedRunner.id}`}>
              <Button
                size="lg"
                mode={ButtonType.PRIMARY}
                text="View Results"
                hoverBtnColor={colors.moongray[1000]}
                pressedBtnColor={colors.moongray[900]}
              />
            </Link>
          )}
        </footer>
      </div>
    </MainSectionSurface>
  );
}

export default BenchmarkRunsView;
