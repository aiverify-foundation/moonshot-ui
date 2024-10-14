import React from 'react';
import {
  GradingScale,
  RecipeEvaluationResult,
} from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';
import { RecipeGradeBadge } from './badge';
import { gradeColorsMoonshot, gradeColorsRiskLevel } from './gradeColors';
import { gradingLettersRiskLevelMap } from './mlcReportComponents/constants';
import { RangedBarChart } from './rangedBarChart';
import { RawRecipeMetricsScoresTable } from './rawScoresTable';

type RecipeRatingResultProps = {
  result: RecipeEvaluationResult;
  recipe: Recipe;
  endpointId: string;
};

function RecipeRatingResult(props: RecipeRatingResultProps) {
  const { result, recipe, endpointId } = props;
  const recipeEvaluationSummary = result.evaluation_summary.find(
    (d) => d.model_id === endpointId
  );
  const resultPromptData = result.details.filter(
    (d) => d.model_id === endpointId
  );
  const promptsCount = recipeEvaluationSummary
    ? recipeEvaluationSummary.num_of_prompts
    : '-';
  const gradingScale = result.grading_scale;
  const showRangedBarChart = recipeEvaluationSummary != undefined;
  const showRawScores =
    resultPromptData &&
    resultPromptData.length > 0 &&
    recipeEvaluationSummary &&
    recipeEvaluationSummary.grade === null;

  let gradeColors = gradeColorsMoonshot;
  let isRistLevelGrading = false;
  if (
    Object.keys(gradeColorsRiskLevel)
      .join()
      .includes(Object.keys(gradingScale).join())
  ) {
    gradeColors = gradeColorsRiskLevel;
    isRistLevelGrading = true;
  }

  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center">
        <Icon name={IconName.File} />
        <h3 className="ml-2 text-white font-bold text-[1rem]">{recipe.name}</h3>
      </header>
      <main className="p-4 grid grid-cols-3 items-start justify-items-end">
        <div className="col-span-2 justify-self-start">
          <div className="mb-3">{recipe.description}</div>
          <div className="text-[0.8rem]">
            {promptsCount} out of {recipe.total_prompt_in_recipe} tested
          </div>
        </div>
        {recipeEvaluationSummary && (
          <RecipeGradeBadge
            grade={recipeEvaluationSummary.grade}
            customLetter={
              isRistLevelGrading && recipeEvaluationSummary.grade
                ? gradingLettersRiskLevelMap[
                    recipeEvaluationSummary.grade as keyof typeof gradingLettersRiskLevelMap
                  ]
                : undefined
            }
            gradeColors={gradeColors}
            size={65}
            textSize="2rem"
            textColor={colors.white}
          />
        )}
      </main>
      {showRangedBarChart && (
        <section className="mb-4">
          <RangedBarChart
            gradingScale={gradingScale as GradingScale}
            gradeValue={recipeEvaluationSummary.avg_grade_value}
            gradeColors={gradeColors}
          />
        </section>
      )}

      {showRawScores && (
        <RawRecipeMetricsScoresTable
          recipe={recipe}
          resultPromptData={resultPromptData}
        />
      )}
    </section>
  );
}

export { RecipeRatingResult };
