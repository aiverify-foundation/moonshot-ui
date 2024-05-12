'use client';
import ReactDom from 'next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.development';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';
import { useGetRunnerByIdQuery } from '@/app/services/runner-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Providers } from '@/lib/provider';
import { BenchmarkReport } from './benchmarkReport';

function BenchmarkReportViewer() {
  const router = useRouter();
  const [selectedEndpointId, setSelectedEndpointId] = useState('');
  const [id, setId] = useState<string | undefined>(undefined);
  const { data: benchmarkResultData, isFetching: benchmarkResultIsFetching } =
    useGetBenchmarksResultQuery({ id: !id ? undefined : id }, { skip: !id });
  const { data: runnerData, isFetching: runnerIsFetching } =
    useGetRunnerByIdQuery({ id: id }, { skip: !id });

  const endpointOptions = benchmarkResultData
    ? benchmarkResultData.metadata.endpoints.map((endpoint) => ({
        label: endpoint,
        value: endpoint,
      }))
    : [];

  const handleDownloadHtmlReport = () => {
    if (benchmarkResultData) {
      const htmlString = ReactDom.renderToStaticMarkup(
        <Providers>
          <BenchmarkReport
            benchmarkResult={benchmarkResultData}
            endpointId={selectedEndpointId}
            runnerInfo={runnerData as Runner}
          />
        </Providers>
      );
      const blob = new Blob([htmlString], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'benchmark-report.html';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

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

  return !id ? (
    <p>No benchmark result id</p>
  ) : (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/benchmarking')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative flex flex-col items-center h-full">
        {benchmarkResultIsFetching ? (
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
                onClick={handleDownloadHtmlReport}
              />
            </section>
            <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
              <div className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
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
