'use client';
import ReactDom from 'next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.development';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Providers } from '@/lib/provider';
import { BenchmarkReport } from './benchmarkReport';

function BenchmarkReportViewer() {
  const router = useRouter();
  const [selectedEndpointId, setSelectedEndpointId] = useState('');
  const [id, setId] = useState<string | null>(null);
  const { data, isFetching } = useGetBenchmarksResultQuery(
    { id: !id ? undefined : id },
    { skip: !id }
  );

  const endpointOptions = data
    ? data.metadata.endpoints.map((endpoint) => ({
        label: endpoint,
        value: endpoint,
      }))
    : [];

  const handleDownloadHtmlReport = () => {
    if (data) {
      const htmlString = ReactDom.renderToStaticMarkup(
        <Providers>
          <BenchmarkReport
            benchmarkResult={data}
            endpointId={selectedEndpointId}
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
    if (isFetching) return;
    if (data) {
      setSelectedEndpointId(data.metadata.endpoints[0]);
    }
  }, [data, isFetching]);

  return !id ? (
    <p>No benchmark result id</p>
  ) : (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/benchmarking')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative flex flex-col items-center h-full">
        {isFetching ? (
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
                {data && (
                  <BenchmarkReport
                    benchmarkResult={data}
                    endpointId={selectedEndpointId}
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
