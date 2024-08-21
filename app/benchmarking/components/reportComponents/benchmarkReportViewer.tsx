'use client';
import { useState } from 'react';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/types/benchmarkReportTypes';
import { BenchmarkReport } from './benchmarkReport';
import { HeaderControls } from './headerControls';

type BenchmarkReportViewerProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  runnerNameAndDescription: RunnerHeading;
  cookbookCategoryLabels: CookbookCategoryLabels;
  cookbooksInReport: Cookbook[];
  mlcCookbookResult?: CookbookResult;
  mlcRecipes?: Recipe[];
};

function BenchmarkReportViewer(props: BenchmarkReportViewerProps) {
  const { benchmarkResult } = props;
  const [selectedEndpointId, setSelectedEndpointId] = useState(
    benchmarkResult.metadata.endpoints[0]
  );

  return (
    <div className="relative flex flex-col gap-5 items-center h-full">
      <HeaderControls
        benchmarkResult={benchmarkResult}
        onEndpointChange={setSelectedEndpointId}
      />
      <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
        <div
          id="report-content"
          className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
          <BenchmarkReport
            {...props}
            endpointId={selectedEndpointId}
          />
        </div>
      </section>
    </div>
  );
}

export { BenchmarkReportViewer };
