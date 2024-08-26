import React from 'react';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { calcTotalPromptsByEndpoint } from '@/app/benchmarking/utils/calcTotalPromptsByEndpoint';
import { Button, ButtonType } from '@/app/components/button';
import { CookbookReportCard } from './cookbookReportCard';
import {
  MLC_AI_SAFETY_COOKBOOK_ID,
  MLC_RECIPE_IDS,
} from './mlcReportComponents/constants';
import { RecipeRatingResult } from './recipeRatingResult';
import { ReportLogo } from './reportLogo';
import { RunSummary } from './runSummary';
import { StandardRatingsInterpretation } from './standardRatingsInterpretation';
import { hasAnyOfSpecificRecipes } from './utils';

const MlcSafetyBaselineGrades = React.lazy(
  () => import('./mlcReportComponents/mlcSafetyBaselineGrades')
);
const MlcAISafetyCookbookReportCard = React.lazy(
  () => import('./mlcReportComponents/mlcAISafetyCookbookReportCard')
);
const MlcRatingsInterpretation = React.lazy(
  () => import('./mlcReportComponents/ratingsInterpretation')
);
const MlcAiSafetyRecipeRatingResult = React.lazy(
  () => import('./mlcReportComponents/mlcAiSafetyRecipeRatingResult')
);

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  runnerNameAndDescription: RunnerHeading;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: CookbookCategoryLabels;
  recipes: Recipe[];
  expanded?: boolean;
  overflowY?: React.CSSProperties['overflowY'];
};

function LoadingText() {
  return <p className="text-white px-6">Loading...</p>;
}

const Report = React.forwardRef<HTMLDivElement, BenchmarkReportProps>(
  (props, ref) => {
    const {
      benchmarkResult,
      runnerNameAndDescription,
      endpointId,
      cookbooksInReport,
      cookbookCategoryLabels,
      recipes,
      expanded = false,
      overflowY = 'auto',
    } = props;
    const downloadUrl = `/api/v1/benchmarks/results/${benchmarkResult.metadata.id}?download=true`;
    const totalPrompts = React.useMemo(
      () => calcTotalPromptsByEndpoint(benchmarkResult, endpointId),
      [benchmarkResult.metadata.id, endpointId]
    );
    const mlcAISafetyCookbookResult: CookbookResult | undefined =
      benchmarkResult.results.cookbooks.find(
        (result) => result.id === MLC_AI_SAFETY_COOKBOOK_ID
      );
    const hasMlcAISafetyCookbookResult =
      mlcAISafetyCookbookResult !== undefined;
    let standardCookbooksHasMlcRecipes: boolean | undefined;
    let standardCookbooks: Cookbook[] = [];
    let mlcAISafetyCookbook: Cookbook | undefined;
    const standardCookbookResults: CookbookResult[] = [];
    let recipesInStandardCookbooks: Recipe[] = [];
    let recipesInMlcAISafetyCookbook: Recipe[] = [];

    if (hasMlcAISafetyCookbookResult) {
      mlcAISafetyCookbook = cookbooksInReport.find(
        (cookbook) => cookbook.id === MLC_AI_SAFETY_COOKBOOK_ID
      );
      recipesInMlcAISafetyCookbook = recipes.filter((recipe) =>
        mlcAISafetyCookbook
          ? mlcAISafetyCookbook.recipes.includes(recipe.id)
          : false
      );
      standardCookbooks = cookbooksInReport.filter(
        (cookbook) => cookbook.id !== MLC_AI_SAFETY_COOKBOOK_ID
      );
    } else {
      standardCookbooks = cookbooksInReport;
      standardCookbooksHasMlcRecipes = hasAnyOfSpecificRecipes(
        MLC_RECIPE_IDS,
        benchmarkResult
      );
    }

    standardCookbooks.forEach((cookbook) => {
      const result = benchmarkResult.results.cookbooks.find(
        (result) => result.id === cookbook.id
      );
      if (result) {
        standardCookbookResults.push(result);
        recipesInStandardCookbooks.push(
          ...recipes.filter((recipe) => cookbook.recipes.includes(recipe.id))
        );
      }
    });

    recipesInStandardCookbooks = Array.from(
      new Set(recipesInStandardCookbooks)
    );
    recipesInMlcAISafetyCookbook = Array.from(
      new Set(recipesInMlcAISafetyCookbook)
    );

    const reportHeader = (
      <hgroup className="p-6 pb-0 text-reportText">
        <ReportLogo
          width={280}
          className="mb-10"
        />
        <h1 className="text-[2.3rem] text-white mb-2">Benchmark Report</h1>
        <p className="mb-3 font-bold">{runnerNameAndDescription.name}</p>
        <p className="mb-5">{runnerNameAndDescription.description}</p>
      </hgroup>
    );

    const fullResultsHeading = (
      <header className="bg-moongray-1000 px-6 py-8">
        <hgroup>
          {hasMlcAISafetyCookbookResult && (
            <p className="text-fuchsia-400">Section 2</p>
          )}
          <h2 className="text-[1.8rem] text-white flex">Full Results</h2>
        </hgroup>
      </header>
    );

    return (
      <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
        <div
          ref={ref}
          id="report-content"
          className="h-full overflow-x-hidden custom-scrollbar"
          style={{ overflowY }}>
          <article className="flex flex-col gap-8 bg-moongray-800">
            {reportHeader}
            <RunSummary
              resultId={benchmarkResult.metadata.id}
              cookbooksInReport={cookbooksInReport}
              cookbookCategoryLabels={cookbookCategoryLabels}
              endpointId={endpointId}
              totalPrompts={totalPrompts}
              startTime={benchmarkResult.metadata.start_time}
              endTime={benchmarkResult.metadata.end_time}
            />
            {hasMlcAISafetyCookbookResult && (
              <React.Suspense fallback={<div>Loading...</div>}>
                <MlcSafetyBaselineGrades
                  benchmarkResult={benchmarkResult}
                  endpointId={endpointId}
                  recipesInMlcAISafetyCookbook={recipesInMlcAISafetyCookbook}
                  expanded={expanded}
                />
              </React.Suspense>
            )}
            {fullResultsHeading}
            <p className="px-6 text-reportText text-[0.9rem]">
              Each cookbook dedicated to testing a specific area can contain
              multiple recipes, each testing different subsets of that area. The
              overall rating for the tested area is determined by considering
              the lowest rating obtained among these recipes. Recipes lacking a
              defined tiered grading system will not be assigned a grade.
            </p>
            {standardCookbooksHasMlcRecipes ? (
              <React.Suspense fallback={<LoadingText />}>
                <StandardRatingsInterpretation expanded={expanded}>
                  <MlcRatingsInterpretation expanded={expanded} />
                </StandardRatingsInterpretation>
              </React.Suspense>
            ) : (
              <StandardRatingsInterpretation expanded={expanded} />
            )}
            <section className="h-full w-full text-moongray-300 text-[0.9rem] bg-moongray-800 rounded-lg px-6 flex flex-col gap-4">
              {standardCookbooks.map((cookbook, idx) =>
                standardCookbookResults[idx] ? (
                  <CookbookReportCard
                    result={standardCookbookResults[idx]}
                    key={cookbook.id}
                    cookbook={cookbook}
                    endpointId={endpointId}
                    expanded={expanded}>
                    {standardCookbookResults[idx].recipes.map(
                      (recipeResult) => {
                        const recipe = recipes.find(
                          (recipe) => recipe.id === recipeResult.id
                        );
                        return !recipe ? (
                          <p>No recipe details for {recipeResult.id}</p>
                        ) : MLC_RECIPE_IDS.includes(recipe.id) ? (
                          <React.Suspense fallback={<LoadingText />}>
                            <MlcAiSafetyRecipeRatingResult
                              key={recipeResult.id}
                              result={recipeResult}
                              recipe={recipe}
                              endpointId={endpointId}
                            />
                          </React.Suspense>
                        ) : (
                          <RecipeRatingResult
                            key={recipeResult.id}
                            result={recipeResult}
                            recipe={recipe}
                            endpointId={endpointId}
                          />
                        );
                      }
                    )}
                  </CookbookReportCard>
                ) : null
              )}
              {hasMlcAISafetyCookbookResult && mlcAISafetyCookbook ? (
                <React.Suspense fallback={<LoadingText />}>
                  <MlcAISafetyCookbookReportCard
                    result={mlcAISafetyCookbookResult}
                    cookbook={mlcAISafetyCookbook}
                    endpointId={endpointId}
                    recipes={recipesInMlcAISafetyCookbook}
                    expanded={expanded}
                  />
                </React.Suspense>
              ) : null}
            </section>
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
);

Report.displayName = 'Report';

export { Report };
