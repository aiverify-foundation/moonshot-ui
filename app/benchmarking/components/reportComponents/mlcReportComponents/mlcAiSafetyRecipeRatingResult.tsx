import React from 'react';
import { RecipeGradeBadge } from '@/app/benchmarking/components/reportComponents/badge';
import { gradeColorsMlc } from '@/app/benchmarking/components/reportComponents/gradeColors';
import { gradingLettersMlcMap } from '@/app/benchmarking/components/reportComponents/mlcReportComponents/constants';
import { RangedBarChart } from '@/app/benchmarking/components/reportComponents/rangedBarChart';
import { RawRecipeMetricsScoresTable } from '@/app/benchmarking/components/reportComponents/rawScoresTable';
import {
  GradingScale,
  RecipeEvaluationResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';

type MlcAiSafetyRecipeRatingResultProps = {
  result: RecipeEvaluationResult;
  recipe: Recipe;
  endpointId: string;
};

export default function MlcAiSafetyRecipeRatingResult(
  props: MlcAiSafetyRecipeRatingResultProps
) {
  const { result, recipe, endpointId } = props;
  const recipeEvaluationSummary = result.evaluation_summary.find(
    (d) => d.model_id === endpointId
  );
  const recipeDetails = result.details.filter((d) => d.model_id === endpointId);
  const promptsCount = recipeEvaluationSummary
    ? recipeEvaluationSummary.num_of_prompts
    : '-';
  const gradingScale = result.grading_scale;
  const showRangedBarChart = recipeEvaluationSummary != undefined;
  const showRawScores =
    recipeDetails &&
    recipeDetails.length > 0 &&
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
          <p className="mb-3">{recipe.description}</p>
          <p className="text-[0.8rem]">
            {promptsCount} out of {recipe.total_prompt_in_recipe} tested
          </p>
        </div>
        {recipeEvaluationSummary && (
          <RecipeGradeBadge
            grade={recipeEvaluationSummary.grade}
            customLetter={
              gradingLettersMlcMap[
                recipeEvaluationSummary.grade as keyof typeof gradingLettersMlcMap
              ]
            }
            gradeColors={gradeColorsMlc}
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
            gradeColors={gradeColorsMlc}
          />
        </section>
      )}

      {showRawScores && (
        <RawRecipeMetricsScoresTable
          recipe={recipe}
          resultPromptData={recipeDetails}
        />
      )}
    </section>
  );
}
