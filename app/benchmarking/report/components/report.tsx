import React from 'react';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { calcTotalPromptsByEndpoint } from '@/app/benchmarking/utils/calcTotalPromptsByEndpoint';
import { Button, ButtonType } from '@/app/components/button';
import { CookbookLabelLegend } from './cookbookLabelLegend';
import { CookbookReportCard } from './cookbookReportCard';
import {
  MLC_AI_SAFETY_COOKBOOK_ID,
  MLC_RECIPE_IDS,
} from './mlcReportComponents/constants';
import { RecipeRatingResult } from './recipeRatingResult';
import { ReportFullResultHeader } from './reportFullResultHeader';
import { ReportHeading } from './reportHeading';
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
  () => import('./mlcReportComponents/mlcRatingsInterpretation')
);
const MlcAiSafetyRecipeRatingResult = React.lazy(
  () => import('./mlcReportComponents/mlcAiSafetyRecipeRatingResult')
);

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  endpointName: string;
  runnerNameAndDescription: RunnerHeading;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: CookbookCategoryLabels;
  recipes: Recipe[];
  expanded?: boolean;
};

function LoadingText() {
  return <div className="text-white px-6">Loading...</div>;
}

const Report = React.forwardRef<HTMLDivElement, BenchmarkReportProps>(
  (props, ref) => {
    const {
      benchmarkResult,
      runnerNameAndDescription,
      endpointId,
      endpointName,
      cookbooksInReport,
      cookbookCategoryLabels,
      recipes,
      expanded = false,
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

    return (
      <div
        className="flex-1 h-full border border-white
        rounded-lg overflow-hidden pr-[2px] py-[2px] max-w-[1120px]">
        <div
          ref={ref}
          id="report-content"
          className="h-full overflow-x-hidden custom-scrollbar">
          <article className="flex flex-col gap-8 bg-moongray-800">
            <ReportHeading
              runnerNameAndDescription={runnerNameAndDescription}
            />
            <RunSummary
              cookbooksInReport={cookbooksInReport}
              cookbookCategoryLabels={cookbookCategoryLabels}
              endpointName={endpointName}
              totalPrompts={totalPrompts}
              startTime={benchmarkResult.metadata.start_time}
              endTime={benchmarkResult.metadata.end_time}
            />
            <CookbookLabelLegend resultId={benchmarkResult.metadata.id} />
            {hasMlcAISafetyCookbookResult && (
              <React.Suspense fallback={<div>Loading...</div>}>
                <MlcSafetyBaselineGrades
                  benchmarkResult={benchmarkResult}
                  endpointId={endpointId}
                  recipesInMlcAISafetyCookbook={recipesInMlcAISafetyCookbook}
                />
                <MlcRatingsInterpretation expanded={expanded} />
              </React.Suspense>
            )}
            <ReportFullResultHeader
              showSectionLabel={hasMlcAISafetyCookbookResult}
            />
            {standardCookbooksHasMlcRecipes ? (
              <React.Fragment>
                <StandardRatingsInterpretation expanded={expanded} />
                <React.Suspense fallback={<LoadingText />}>
                  <MlcRatingsInterpretation expanded={expanded} />
                </React.Suspense>
              </React.Fragment>
            ) : (
              <StandardRatingsInterpretation expanded={expanded} />
            )}

            <section
              className="h-full w-full text-moongray-300 text-[0.9rem]
                bg-moongray-800 rounded-lg px-6 flex flex-col gap-4">
              {standardCookbooks.map((cookbook, idx) =>
                standardCookbookResults[idx] ? (
                  <CookbookReportCard
                    result={standardCookbookResults[idx]}
                    key={cookbook.id}
                    cookbook={cookbook}
                    endpointId={endpointId}
                    expanded={expanded}>
                    {standardCookbookResults[idx].recipes.map(
                      (recipeResult, i) => {
                        const recipe = recipes.find(
                          (recipe) => recipe.id === recipeResult.id
                        );
                        if (!recipe) {
                          return (
                            <div key={recipeResult.id}>
                              No recipe details for {recipeResult.id}
                            </div>
                          );
                        }

                        const Break = i > 0 && i % 2 === 0 && (
                          <div className="break-before-page h-[40px]" />
                        );

                        if (MLC_RECIPE_IDS.includes(recipe.id)) {
                          return (
                            <React.Suspense
                              fallback={<LoadingText />}
                              key={recipeResult.id}>
                              <>
                                {Break}
                                <MlcAiSafetyRecipeRatingResult
                                  result={recipeResult}
                                  recipe={recipe}
                                  endpointId={endpointId}
                                />
                              </>
                            </React.Suspense>
                          );
                        }

                        return (
                          <React.Fragment key={recipeResult.id}>
                            {Break}
                            <RecipeRatingResult
                              result={recipeResult}
                              recipe={recipe}
                              endpointId={endpointId}
                            />
                          </React.Fragment>
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
                    expanded={expanded}>
                    {mlcAISafetyCookbookResult.recipes.map(
                      (recipeResult, i) => {
                        const recipeDetails = recipes.find(
                          (recipe) => recipe.id === recipeResult.id
                        );
                        return recipeDetails ? (
                          <React.Fragment key={recipeResult.id}>
                            {i > 0 && i % 2 === 0 && (
                              <div className="break-before-page h-[40px]" />
                            )}
                            <MlcAiSafetyRecipeRatingResult
                              result={recipeResult}
                              recipe={recipeDetails}
                              endpointId={endpointId}
                            />
                          </React.Fragment>
                        ) : (
                          <div key={recipeResult.id}>
                            No recipe details for {recipeResult.id}
                          </div>
                        );
                      }
                    )}
                  </MlcAISafetyCookbookReportCard>
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
      </div>
    );
  }
);

Report.displayName = 'Report';

export { Report };
