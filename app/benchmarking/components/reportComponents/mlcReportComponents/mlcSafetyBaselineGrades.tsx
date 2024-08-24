import React from 'react';
import { SquareBadge } from '@/app/benchmarking/components/reportComponents/badge';
import {
  extractCookbookResults,
  extractRecipeIds,
} from '@/app/benchmarking/components/reportComponents/utils';
import { CookbookCategoryLabels } from '@/app/benchmarking/types/benchmarkReportTypes';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import {
  gradingDescriptionsMlcMap,
  gradingLettersMlcMap,
  MLC_COOKBOOK_IDS,
} from './constants';
import { GradingLevelsMlcEnum } from './enums';
import { gradeColorsMlc } from './gradeColors';
import RatingsInterpretation from './ratingsInterpretation';
import { getMlcRecipes } from './serverActions/getMlcRecipes';

type BenchmarkReportProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  runnerNameAndDescription: RunnerHeading;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: CookbookCategoryLabels;
};

export default function MlcSafetyBaselineGrades(props: BenchmarkReportProps) {
  const { benchmarkResult, endpointId } = props;
  const [mlcRecipes, setMlcRecipes] = React.useState<Recipe[]>([]);
  const [isPending, startTransition] = React.useTransition();

  // 👉 This component displays results for Safety Baseline v0.5. The results must be based on ONLY 1 cookbook - 'mlc-ai-safety'.
  const mlcCookbookResults = extractCookbookResults(benchmarkResult, [
    MLC_COOKBOOK_IDS[0], // Safety Baseline v0.5 ('mlc-ai-safety')
  ]);

  const mlcAISafetyCookbookResult = mlcCookbookResults[0];

  React.useEffect(() => {
    if (mlcCookbookResults.length === 0) {
      return;
    }
    const mlcRecipeIds = Array.from(
      new Set(extractRecipeIds(mlcCookbookResults))
    );
    if (mlcRecipeIds.length === 0) {
      return;
    }
    async function callServerAction() {
      startTransition(async () => {
        const result = await getMlcRecipes(mlcRecipeIds);
        if ('message' in result) {
          console.error(result.message);
        } else {
          setMlcRecipes(result.data);
        }
      });
    }
    callServerAction();
  }, []);

  const mlsCookbookResultOverallGrade =
    mlcAISafetyCookbookResult.overall_evaluation_summary.find(
      (summary) => summary.model_id === endpointId
    );

  const badgeLabel = mlsCookbookResultOverallGrade
    ? gradingLettersMlcMap[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'None';

  const gradeColor = mlsCookbookResultOverallGrade
    ? gradeColorsMlc[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'gray';

  const overallGradeDescription = mlsCookbookResultOverallGrade
    ? gradingDescriptionsMlcMap[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'None';

  const mlcGrades =
    mlcRecipes.length > 0 ? (
      <section className="grid grid-rows-7 w-[70%] mt-10 gap-6">
        {mlcAISafetyCookbookResult.recipes.map((recipeResult, idx) => {
          const evalSummary = recipeResult.evaluation_summary.find(
            (summary) => summary.model_id === endpointId
          );
          const grade = evalSummary && evalSummary.grade;
          const nameSegments = mlcRecipes[idx].name.split('-');
          const name = mlcRecipes[idx].name.startsWith(
            'MLCommons AI Safety Benchmark -'
          )
            ? nameSegments.slice(1).join('-')
            : mlcRecipes[idx].name;
          return (
            <figure
              className="flex gap-4 justify-between"
              key={recipeResult.id}>
              <figcaption>
                <h5 className="text-[0.9rem] text-white font-bold pb-1">
                  {name}
                </h5>
                <p className="text-[0.8rem] leading-tight">
                  {mlcRecipes[idx].description}
                </p>
              </figcaption>
              <div>
                <SquareBadge
                  size={60}
                  textSize="2rem"
                  label={
                    gradingLettersMlcMap[
                      grade as keyof typeof gradingLettersMlcMap
                    ]
                  }
                  color={
                    gradeColorsMlc[grade as keyof typeof gradingLettersMlcMap]
                  }
                />
              </div>
            </figure>
          );
        })}
      </section>
    ) : (
      <p>No recipes found</p>
    );

  return (
    <article
      className="h-full w-full text-[0.9rem] bg-moongray-9400
      rounded-lg text-reportText">
      <header
        className="bg-moongray-1000 px-6 py-8"
        style={{ backgroundColor: '#202020' }}>
        <hgroup>
          <p className="text-fuchsia-400">Section 1</p>
          <h2 className="text-[1.8rem] text-white flex">
            <span className="text-[1.5rem] mr-2">Results for</span>
            <Icon name={IconName.Book} />
            <span className="text-[1.7rem] font-semibold ml-1">
              Safety Baseline v0.5
            </span>
          </h2>
        </hgroup>
      </header>

      <section
        className="bg-moongray-800 p-6"
        style={{ backgroundColor: '#464349' }}>
        <section className="p-6">
          <div
            className="flex gap-2 text-[0.9rem] text-moongray-300 p-5 rounded-lg"
            style={{ backgroundColor: '#6B544E', color: '#bcb9c0' }}>
            <Icon
              color="#bcb9c0"
              name={IconName.Warning}
              size={40}
            />
            <p>
              The AI Verify x MLCommons AI Safety Baseline Benchmark v0.5 is a
              proof of concept only. Results are not intended to indicate actual
              levels of AI system safety.
            </p>
          </div>

          <p className="py-8">
            The overall safety rating for an Endpoint is calculated by taking
            the worst of the per-hazard safety ratings: a model is only as safe
            as its weakest area.
          </p>

          {mlsCookbookResultOverallGrade ? (
            <figure
              id="overallSafetyRating"
              className="flex gap-4 justify-center">
              <SquareBadge
                size={80}
                textSize="2rem"
                label={badgeLabel}
                color={gradeColor}
              />
              <figcaption className="w-[50%]">
                <h5
                  className="text-[0.9rem]"
                  style={{
                    color: gradeColor,
                  }}>
                  {mlsCookbookResultOverallGrade.overall_grade}
                </h5>
                <p className="text-[0.8rem] leading-tight">
                  {overallGradeDescription}
                </p>
              </figcaption>
            </figure>
          ) : null}

          {isPending ? (
            <section className="relative mt-10 h-[100px]">
              <LoadingAnimation />
            </section>
          ) : (
            mlcGrades
          )}
        </section>

        <RatingsInterpretation />
      </section>
    </article>
  );
}
