import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';
import { RecipeGradeBadge } from './components/badge';
import { RangedBarChart } from './components/rangedBarChart';
import { GradingScale, RecipeResult } from './types/benchmarkReportTypes';

type BenchmarkReportRecipeResultProps = {
  result: RecipeResult;
  recipe: Recipe;
  endpointId: string;
};

function BenchmarkReportRecipeResult(props: BenchmarkReportRecipeResultProps) {
  const { result, recipe, endpointId } = props;
  const recipeEvaluationSummary = result.evaluation_summary.find(
    (d) => d.model_id === endpointId
  );
  const promptsCount = recipeEvaluationSummary
    ? recipeEvaluationSummary.num_of_prompts
    : '-';
  const gradingScale = recipe.grading_scale;

  return (
    <section className="bg-moongray-950 rounded-lg flex flex-col gap-4">
      <header className="flex items-center">
        <Icon name={IconName.File} />
        <h3 className="ml-2 text-white font-bold">{recipe.name}</h3>
      </header>
      <main className="p-4 grid grid-cols-3 items-start justify-items-end">
        <div className="col-span-2">
          <p>{recipe.description}</p>
          <p>
            {promptsCount} out of {recipe.total_prompt_in_recipe} tested
          </p>
        </div>
        {recipeEvaluationSummary && (
          <RecipeGradeBadge
            grade={recipeEvaluationSummary.grade}
            size={65}
            textSize="2rem"
            textColor={colors.white}
          />
        )}
      </main>
      <section>
        {recipeEvaluationSummary && (
          <RangedBarChart
            gradingScale={gradingScale as GradingScale}
            gradeValue={recipeEvaluationSummary.avg_grade_value}
          />
        )}
      </section>
    </section>
  );
}

export { BenchmarkReportRecipeResult };
