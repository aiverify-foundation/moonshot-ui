import React from 'react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { Button, ButtonType } from '@/app/components/button';
import { BenchmarkReportSectionOne } from './benchmarkReportSectionOne';
import { BenchmarkReportSectionTwo } from './benchmarkReportSectionTwo';
import { CookbookCategoryLabels } from './types';

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  runnerNameAndDescription: RunnerHeading;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: CookbookCategoryLabels;
};

function BenchmarkReport(props: BenchmarkReportProps) {
  const {
    benchmarkResult,
    endpointId,
    runnerNameAndDescription,
    cookbookCategoryLabels,
    cookbooksInReport,
  } = props;
  const downloadUrl = `/api/v1/benchmarks/results/${benchmarkResult.metadata.id}?download=true`;
  return (
    <div
      className="flex flex-col gap-8 bg-moongray-800"
      style={{ backgroundColor: '#464349' }}>
      <BenchmarkReportSectionOne
        benchmarkReport={benchmarkResult}
        endpointId={endpointId}
        runnerNameAndDescription={runnerNameAndDescription}
        cookbooksInReport={cookbooksInReport}
        cookbookCategoryLabels={cookbookCategoryLabels}
      />
      <BenchmarkReportSectionTwo
        benchmarkResult={benchmarkResult}
        endpointId={endpointId}
      />
      <footer className="flex justify-center pb-10">
        <a
          data-download="hide"
          href={downloadUrl}
          download>
          <Button
            mode={ButtonType.OUTLINE}
            size="lg"
            text="Download Detailed Scoring JSON"
            hoverBtnColor="#524e56"
          />
        </a>
      </footer>
    </div>
  );
}

export { BenchmarkReport };
