'use client';
import { useState } from 'react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { downloadHtmlReport } from '@/app/benchmarking/utils/reportDownloader';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { colors } from '@/app/customColors';
import { BenchmarkReport } from './benchmarkReport';
import { CookbookCategoryLabels } from './types';

type BenchmarkReportViewerProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  runnerNameAndDescription: RunnerHeading;
  cookbookCategoryLabels: CookbookCategoryLabels;
  cookbooksInReport: Cookbook[];
};

function BenchmarkReportViewer(props: BenchmarkReportViewerProps) {
  const {
    benchmarkResult,
    runnerNameAndDescription,
    cookbookCategoryLabels,
    cookbooksInReport,
  } = props;
  const [selectedEndpointId, setSelectedEndpointId] = useState(
    benchmarkResult.metadata.endpoints[0]
  );

  const endpointOptions = benchmarkResult.metadata.endpoints.map(
    (endpoint) => ({
      label: endpoint,
      value: endpoint,
    })
  );

  return (
    <div className="relative flex flex-col items-center h-full">
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
            onClick={() => downloadHtmlReport(benchmarkResult.metadata.id)}
            hoverBtnColor={colors.moongray[800]}
          />
        </section>
        <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
          <div
            id="report-content"
            className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
            <BenchmarkReport
              benchmarkResult={benchmarkResult}
              endpointId={selectedEndpointId}
              runnerNameAndDescription={runnerNameAndDescription}
              cookbookCategoryLabels={cookbookCategoryLabels}
              cookbooksInReport={cookbooksInReport}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export { BenchmarkReportViewer };
