import { Fragment, useEffect, useRef, useState } from 'react';
import { Window } from '@/app/components/window';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';
import { Icon, IconName } from '@/app/components/IconSVG';

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

const Col1Percent = 12;
const Col2Pixel = 180;

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
        <div className="flex bg-fuchsia-1000 divide-x divide-neutral-400 pt-2 h-16 ">
          <div
            className={`COL-1 flex items-center pl-2 text-lg`}
            style={{ width: `${Col1Percent}%`, minWidth: 200 }}>
            Cookbook
          </div>
          <div
            className={`COL-2 flex items-center pl-2 text-lg`}
            style={{ width: `${Col2Pixel}px`, minWidth: 150 }}>
            Recipe
          </div>
          <div className="flex items-center text-lg pl-2">Benchmarking</div>
        </div>
        <div
          id="endpointNameHeader"
          className="flex text-gray-950 w-full bg-white h-[60px] divide-x divide-neutral-400">
          <div
            className={`COL-1 bg-fuchsia-1000`}
            style={{ width: `${Col1Percent}%`, minWidth: 200 }}
          />
          <div
            className={`COL-2 bg-fuchsia-1000`}
            style={{ width: `${Col2Pixel}px`, minWidth: 150 }}
          />
          <div
            className="grow flex items-center divide-x 
            divide-neutral-400 bg-fuchsia-1000/80 text-white">
            {data.metadata.endpoints.map((ep) => (
              <div
                key={ep}
                className="w-[49.7%] h-full text-sm flex flex-col">
                {' '}
                {/* need the weird percentage value to align with the bottom of the table having scrollbar */}
                <div className="text-lg pl-2 underline pb-1">
                  <div className="flex gap-2">
                    <Icon
                      name={IconName.SolidBox}
                      size={12}
                      lightModeColor="white"
                    />
                    <div>{ep}</div>
                  </div>
                </div>
                <div className="flex flex-1 divide-x divide-gray-400 text-xs bg-fuchsia-1000/30">
                  <div className="shrink-0 basis-[150px] pl-2 pt-1 COL-3">
                    Dataset
                  </div>
                  <div className="grow h-full flex flex-col divide-y divide-gray-400">
                    <div className="grow flex divide-x divide-gray-400 justify-center">
                      <div className="basis-[50%] pl-2 pt-1">
                        Prompt Template
                      </div>
                      <div className="grow pl-2 pt-1">Metrics</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-hidden overflow-y-auto custom-scrollbar divide-y divide-neutral-400">
          {data.results.cookbooks.map((book, idx) => (
            <div
              key={book.id}
              className={`text-gray-950 border-b-2 border-black ${idx % 2 === 0 ? 'bg-slate-400' : 'bg-slate-300'}`}>
              <div className="flex divide-x divide-gray-400">
                <div
                  className={`COL-1 shrink-0 px-3`}
                  style={{ width: `${Col1Percent}%`, minWidth: 200 }}>
                  {book.id}
                </div>
                <div
                  className="grow basis-[85%] flex flex-col"
                  style={{ width: `${Col2Pixel}px`, minWidth: 150 }}>
                  {book.recipes.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className={`flex min-h-[75px] divide-x divide-gray-400
                        ${idx % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
                      <div
                        className={`flex-initial px-2 COL-2`}
                        style={{ width: `${Col2Pixel}px`, minWidth: 150 }}>
                        {rec.id}
                      </div>
                      <div className="grow flex divide-x divide-gray-400">
                        {!rec.models.length ? (
                          <div className="grow px-3 text-center pt-2">
                            No output
                          </div>
                        ) : null}
                        {rec.models.map((model) => (
                          <div
                            key={model.id}
                            className="basis-[50%] min-w-[530px] grow">
                            <div className="flex flex-col h-full">
                              {model.datasets.map((dat, idx) => (
                                <div
                                  key={dat.id}
                                  className={`flex flex-1 divide-x divide-gray-400 ${
                                    model.datasets.length > 1
                                      ? idx % 2 === 0
                                        ? 'bg-slate-200/80'
                                        : 'bg-slate-100/80'
                                      : ''
                                  }`}>
                                  <div className="basis-[150px] pl-2 COL-3">
                                    {dat.id}
                                  </div>
                                  <div className="grow h-full flex flex-col divide-y divide-gray-400">
                                    {dat.prompt_templates.map((pt, idx) => (
                                      <div
                                        key={pt.id}
                                        className="grow flex divide-x divide-gray-400">
                                        <div className="basis-[50%] pl-2">
                                          {pt.id}
                                        </div>
                                        <div className="grow">
                                          {pt.metrics.map((mt, idx) => (
                                            <div
                                              key={`${pt.id}-${idx}`}
                                              className="flex">
                                              {Object.entries(mt).map(
                                                ([metricName, metricValue]) => (
                                                  <div
                                                    key={metricName}
                                                    className="flex gap-2 pl-2">
                                                    <div>{metricName}:</div>
                                                    <div className="text-blue-700 font-bold">
                                                      {metricValue}
                                                    </div>
                                                  </div>
                                                )
                                              )}
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
