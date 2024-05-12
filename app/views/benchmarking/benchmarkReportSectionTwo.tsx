import React from 'react';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
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

  const { data, isFetching } = useGetCookbooksQuery({ ids: cookbooks });

  return (
    <article className="h-full w-full text-moongray-300 text-[0.9rem] bg-moongray-800 rounded-lg ">
      <header className="bg-moongray-1000 px-6 py-8">
        <hgroup>
          <p className="text-fuchsia-400">Section 2</p>
          <h2 className="text-[1.8rem] text-white flex">Full Results</h2>
        </hgroup>
      </header>

      <section
        id="resultsSafetyBaseline"
        className="bg-moongray-800 p-6">
        <p className="mb-10">
          Each cookbook dedicated to testing a specific area can contain
          multiple recipes, each testing different subsets of that area. The
          overall rating for the tested area is determined by considering the
          lowest rating obtained among these recipes. Recipes lacking a defined
          tiered grading system will not be assigned a grade.
        </p>

        {isFetching && (
          <div className="w-full relative">
            <LoadingAnimation />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {!isFetching &&
            data &&
            cookbooks.map((cookbook, idx) => {
              const cookbookDetails = data.find((c) => c.id === cookbook);
              return !cookbookDetails ? (
                <p>No cookbook data</p>
              ) : (
                <BenchmarkReportCookbookResult
                  result={cookbookResultList[idx]}
                  key={cookbook}
                  cookbook={cookbookDetails}
                  endpointId={endpointId}
                />
              );
            })}
        </div>
      </section>
    </article>
  );
}

export { BenchmarkReportSectionTwo };
