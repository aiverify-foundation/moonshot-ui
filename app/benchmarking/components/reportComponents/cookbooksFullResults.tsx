import React from 'react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { SquareBadge } from './badge';
import { BenchmarkReportCookbookResult } from './benchmarkReportCookbookResult';
import { gradeColorsMoonshot } from './gradeColors';

type CookbookFullResultsProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  cookbooksInReport: Cookbook[];
  endpointId: string;
};

function CookbooksFullResults(props: CookbookFullResultsProps) {
  const { benchmarkResult, endpointId, cookbooksInReport } = props;
  const cookbookResultList = benchmarkResult.results.cookbooks;
  const sortedResultsByCookbooksInReport = cookbooksInReport.map((cookbook) =>
    cookbookResultList.find((result) => result.id === cookbook.id)
  );
  const [expandAERatings, setExpandAERatings] = React.useState(false);
  return (
    <article className="h-full w-full text-moongray-300 text-[0.9rem] bg-moongray-800 rounded-lg ">
      <div className="p-6">
        <section className="flex flex-col gap-4">
          {cookbooksInReport.map((cookbook, idx) => {
            if (!sortedResultsByCookbooksInReport[idx]) {
              return (
                <div key={cookbook.id}>
                  No results found for cookbook {cookbook.id}
                </div>
              );
            }
            return (
              <BenchmarkReportCookbookResult
                result={sortedResultsByCookbooksInReport[idx]}
                key={cookbook.id}
                cookbook={cookbook}
                endpointId={endpointId}
              />
            );
          })}
        </section>
      </div>
    </article>
  );
}

export { CookbooksFullResults };
