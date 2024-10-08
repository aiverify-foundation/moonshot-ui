import React from 'react';
import {
  GradingScale,
  RecipeEvaluationResult,
} from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';
import { RecipeGradeBadge } from './badge';
import { gradeColorsMoonshot } from './gradeColors';
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

  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center">
        <Icon name={IconName.File} />
        <h3 className="ml-2 text-white font-bold text-[1rem]">{recipe.name}</h3>
      </header>
      <main className="p-4 grid grid-cols-3 items-start justify-items-end">
        <div className="col-span-2">
          <div className="mb-3">{recipe.description}</div>
          <div className="text-[0.8rem]">
            {promptsCount} out of {recipe.total_prompt_in_recipe} tested
          </div>
        </div>
        {recipeEvaluationSummary && (
          <RecipeGradeBadge
            grade={recipeEvaluationSummary.grade}
            gradeColors={gradeColorsMoonshot}
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
            gradeColors={gradeColorsMoonshot}
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
