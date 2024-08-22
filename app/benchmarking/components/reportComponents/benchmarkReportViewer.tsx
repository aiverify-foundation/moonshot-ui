'use client';
import { useState } from 'react';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/types/benchmarkReportTypes';
import { HeaderControls } from './headerControls';
import { Report } from './report';

type BenchmarkReportViewerProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  runnerNameAndDescription: RunnerHeading;
  cookbookCategoryLabels: CookbookCategoryLabels;
  cookbooksInReport: Cookbook[];
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
      <Report
        {...props}
        endpointId={selectedEndpointId}
      />
    </div>
  );
}

export { BenchmarkReportViewer };
