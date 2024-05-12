import React from 'react';
import { BenchmarkReportSectionOne } from './benchmarkReportSectionOne';
import { BenchmarkReportSectionTwo } from './benchmarkReportSectionTwo';
import { CookbooksBenchmarkResult } from './types/benchmarkReportTypes';

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
};

function BenchmarkReport(props: BenchmarkReportProps) {
  const { benchmarkResult, endpointId } = props;
  return (
    <div className="flex flex-col gap-8 bg-moongray-800">
      <BenchmarkReportSectionOne
        benchmarkReport={benchmarkResult}
        endpointId={endpointId}
      />
      <BenchmarkReportSectionTwo
        benchmarkResult={benchmarkResult}
        endpointId={endpointId}
      />
    </div>
  );
}

export { BenchmarkReport };
