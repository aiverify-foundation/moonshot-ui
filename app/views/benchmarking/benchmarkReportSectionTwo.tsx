import React from 'react';
import { BenchmarkReportCookbookResult } from './benchmarkReportCookbookResult';
import { CookbooksBenchmarkResult } from './types/benchmarkReportTypes';

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
};

function BenchmarkReportSectionTwo(props: BenchmarkReportProps) {
  const { benchmarkResult, endpointId } = props;
  const { cookbooks } = benchmarkResult.metadata;
  const cookbookResultList = benchmarkResult.results.cookbooks;
  return (
    <article
      className="h-full w-full text-moongray-300 text-[0.9rem] bg-moongray-9400
      rounded-lg ">
      <header className="bg-moongray-950 px-6 py-8">
        <hgroup>
          <p className="text-fuchsia-400">Section 2</p>
          <h2 className="text-[1.8rem] text-white flex">Full Results</h2>
        </hgroup>
      </header>

      <section
        id="resultsSafetyBaseline"
        className="bg-moongray-800 p-6">
        <p>
          Each cookbook dedicated to testing a specific area can contain
          multiple recipes, each testing different subsets of that area. The
          overall rating for the tested area is determined by considering the
          lowest rating obtained among these recipes. Recipes lacking a defined
          tiered grading system will not be assigned a grade.
        </p>

        {cookbooks.map((cookbook, idx) => {
          return (
            <BenchmarkReportCookbookResult
              result={cookbookResultList[idx]}
              key={cookbook}
              endpointId={endpointId}
            />
          );
        })}
      </section>
    </article>
  );
}

export { BenchmarkReportSectionTwo };
