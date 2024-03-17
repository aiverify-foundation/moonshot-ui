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
        <div className="flex bg-fuchsia-1000 divide-x divide-neutral-400 pt-2 h-20 ">
          <div className="flex items-center basis-[15%] pl-2 text-lg COL-1">
            Cookbook
          </div>
          <div className="flex items-center basis-[180px] pl-2 text-lg COL-1">
            Recipe
          </div>
          <div className="flex items-center text-lg pl-2">Benchmarking</div>
        </div>
        <div
          id="endpointNameHeader"
          className="flex text-gray-950 w-full bg-white h-[40px] divide-x divide-neutral-400">
          <div className="basis-[15%] COL-1 bg-fuchsia-1000" />
          <div className="basis-[180px] COL-1 bg-fuchsia-1000" />
          <div
            className="grow flex items-center divide-x 
            divide-neutral-400 bg-fuchsia-1000 text-white">
            {data.metadata.endpoints.map((ep) => (
              <div
                key={ep}
                className="grow pl-2 h-full text-sm">
                {ep}
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-hidden overflow-y-auto custom-scrollbar divide-y divide-neutral-400">
          {data.results.cookbooks.map((book, idx) => (
            <div
              key={book.id}
              className={`text-gray-950 ${idx % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
              <div className="flex divide-x divide-gray-400">
                <div className="shrink-0 px-3 basis-[15%] min-w-[200px] COL-1">
                  {book.id}
                </div>
                <div className="grow basis-[85%] flex flex-col">
                  {book.recipes.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className={`flex min-h-[75px] divide-x divide-gray-400 ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}>
                      <div className="flex-initial basis-[180px] px-2 COL-2">
                        {rec.id}
                      </div>
                      <div className="grow flex divide-x divide-gray-400">
                        {rec.models.map((model) => (
                          <div
                            key={model.id}
                            className="grow px-3">
                            <div className="flex flex-col h-full">
                              {model.datasets.map((dat) => (
                                <div
                                  key={dat.id}
                                  className="flex flex-1 divide-x divide-gray-400">
                                  <div className="basis-[150px] COL-3">
                                    {dat.id}
                                  </div>
                                  <div className="grow flex flex-col COL-4">
                                    {dat.prompt_templates.map((pt) => (
                                      <div
                                        key={pt.id}
                                        className="flex flex-col">
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
