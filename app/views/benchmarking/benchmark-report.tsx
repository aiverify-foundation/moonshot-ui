import { Fragment, useEffect, useRef, useState } from 'react';
import { Window } from '@/app/components/window';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';

type cookbooksExplorerProps = {
  windowId: string;
  benchmarkId: string;
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
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

function BenchmarksResult(props: cookbooksExplorerProps) {
  const {
    windowId,
    benchmarkId = 'cookbook-test1',
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    onCloseClick,
    onWindowChange,
  } = props;
  const { data, error, isLoading, refetch } = useGetBenchmarksResultQuery({
    benchmarkId: benchmarkId,
  });

  return isLoading || !data ? null : (
    <Window
      id={windowId}
      resizeable={true}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}>
      <div className="flex flex-col bg-white w-full h-full">
        <div className="flex bg-fuchsia-1000 divide-x divide-neutral-400 py-2">
          <div className="flex items-center basis-[15%] COL-1">Cookbook</div>
          <div className="flex items-center basis-[15%] COL-1">Recipe</div>
          <div className="flex items-center flex-1 min-w-[600px]">
            Benchmarking
          </div>
        </div>
        <div
          id="resultTableHeader"
          className="flex gap-1 text-gray-950 w-full bg-white h-[40px]">
          <div className="basis-[15%] COL-1" />
          <div className="basis-[15%] COL-1" />
          <div className="flex flex-1 min-w-[600px] items-center bg-fuchsia-900">
            {data.metadata.endpoints.map((ep) => (
              <div
                key={ep}
                className="grow">
                {ep}
              </div>
            ))}
          </div>
        </div>
        <div
          className="overflow-x-hidden overflow-y-auto
      custom-scrollbar mr-[2px]">
          {data.results.cookbooks.map((book) => (
            <div
              key={book.id}
              className="m-1 py-6 text-gray-950">
              <div className="flex divide-x divide-gray-400">
                <div className="flex px-3 shrink-0 basis-[15%] COL-1">
                  {book.id}
                </div>
                <div className="flex flex-col flex-1">
                  {book.recipes.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex px-3 py-4">
                      <div className="flex-initial basis-[15%] COL-2">
                        {rec.id}
                      </div>
                      <div className="flex-1 flex min-w-[600px] COL-3">
                        {rec.models.map((model) => (
                          <div
                            key={model.id}
                            className="grow flex flex-col px-3">
                            <div className="flex flex-col">
                              {model.datasets.map((dat) => (
                                <div
                                  key={dat.id}
                                  className="flex flex-initial gap-2 divide-x divide-gray-400">
                                  <div className="basis-[50%]">{dat.id}</div>
                                  <div className="grow flex flex-col gap-3 pl-3">
                                    {dat.prompt_templates.map((pt) => (
                                      <div
                                        key={pt.id}
                                        className="flex flex-col gap-1">
                                        <div>{pt.id}</div>
                                        {pt.metrics.map((mt, idx) => (
                                          <div
                                            key={`${pt.id}-${idx}`}
                                            className="flex flex-col">
                                            {Object.entries(mt).map(
                                              ([metricName, metricValue]) => (
                                                <div
                                                  key={metricName}
                                                  className="flex gap-2">
                                                  <div>{metricName}</div>
                                                  <div>{metricValue}</div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export { BenchmarksResult };
