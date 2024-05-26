'use client';
import { useEffect, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';
import { useGetRunnerByIdQuery } from '@/app/services/runner-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { BenchmarkReport } from './benchmarkReport';
import { downloadHtmlReport } from './utils/reportDownloader';

function BenchmarkReportViewer() {
  const [selectedEndpointId, setSelectedEndpointId] = useState('');
  const [id, setId] = useState<string | undefined>(undefined);
  const { data: benchmarkResultData, isFetching: benchmarkResultIsFetching } =
    useGetBenchmarksResultQuery({ id: !id ? undefined : id }, { skip: !id });
  const { data: runnerData } = useGetRunnerByIdQuery({ id: id }, { skip: !id });

  const endpointOptions = benchmarkResultData
    ? benchmarkResultData.metadata.endpoints.map((endpoint) => ({
        label: endpoint,
        value: endpoint,
      }))
    : [];

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const idFromURL = searchParams.get('id');
    if (idFromURL !== null) {
      setId(idFromURL);
    }
  }, []);

  useEffect(() => {
    if (benchmarkResultIsFetching) return;
    if (benchmarkResultData) {
      setSelectedEndpointId(benchmarkResultData.metadata.endpoints[0]);
    }
  }, [benchmarkResultData, benchmarkResultIsFetching]);

  return (
    <MainSectionSurface
      closeLinkUrl="/benchmarking"
      height="100%"
      minHeight={750}
      bgColor="#2d2b2f">
      <div className="relative flex flex-col items-center h-full">
        {benchmarkResultIsFetching || !id ? (
          <LoadingAnimation />
        ) : (
          <div className="flex flex-col gap-5 w-full h-full">
            <section className="flex w-full items-center mt-6">
              <div className="flex-1 flex gap-4 items-center">
                <h3 className="text-white text-[1rem]">Showing results for</h3>
                <SelectInput
                  name="endpoint"
                  options={endpointOptions}
                  value={selectedEndpointId}
                  onChange={(value) => setSelectedEndpointId(value)}
                  style={{ marginBottom: 0, width: 400 }}
                />
              </div>

              <Button
                mode={ButtonType.OUTLINE}
                text="Download HTML Report"
                onClick={() => downloadHtmlReport(id)}
                hoverBtnColor={colors.moongray[800]}
              />
            </section>
            <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
              <div
                id="report-content"
                className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
                {benchmarkResultData && runnerData && (
                  <BenchmarkReport
                    benchmarkResult={benchmarkResultData}
                    endpointId={selectedEndpointId}
                    runnerInfo={runnerData}
                  />
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkReportViewer };
