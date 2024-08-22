import React from 'react';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/types/benchmarkReportTypes';
import { calcTotalPromptsByEndpoint } from '@/app/benchmarking/utils/calcTotalPromptsByEndpoint';
import { Button, ButtonType } from '@/app/components/button';
import { BenchmarkReportSectionTwo } from './benchmarkReportSectionTwo';
import { MlcSafetyBaselineGrades } from './mlcReportComponents/mlcSafetyBaselineGrades';
import { ReportLogo } from './reportLogo';
import { RunSummary } from './runSummary';

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  runnerNameAndDescription: RunnerHeading;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: CookbookCategoryLabels;
  mlcCookbookResult?: CookbookResult;
  mlcRecipes?: Recipe[];
};

function Report(props: BenchmarkReportProps) {
  const {
    benchmarkResult,
    runnerNameAndDescription,
    endpointId,
    cookbooksInReport,
    cookbookCategoryLabels,
  } = props;
  const downloadUrl = `/api/v1/benchmarks/results/${benchmarkResult.metadata.id}?download=true`;
  const totalPrompts = React.useMemo(
    () => calcTotalPromptsByEndpoint(benchmarkResult, endpointId), // expensive with large datasets
    [benchmarkResult.metadata.id, endpointId]
  );
  return (
    <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
      <div
        id="report-content"
        className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
        <article
          className="flex flex-col gap-8 bg-moongray-800"
          style={{ backgroundColor: '#464349' }}>
          <hgroup className="p-6 pb-0 text-reportText">
            <ReportLogo
              width={280}
              className="mb-10"
            />
            <h1 className="text-[2.3rem] text-white mb-2">Benchmark Report</h1>
            <p className="mb-3 font-bold">{runnerNameAndDescription.name}</p>
            <p className="mb-5">{runnerNameAndDescription.description}</p>
          </hgroup>
          <RunSummary
            resultId={benchmarkResult.metadata.id}
            cookbooksInReport={cookbooksInReport}
            cookbookCategoryLabels={cookbookCategoryLabels}
            endpointId={endpointId}
            totalPrompts={totalPrompts}
            startTime={benchmarkResult.metadata.start_time}
            endTime={benchmarkResult.metadata.end_time}
          />
          <MlcSafetyBaselineGrades {...props} />
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
        </article>
      </div>
    </section>
  );
}

export { Report };
