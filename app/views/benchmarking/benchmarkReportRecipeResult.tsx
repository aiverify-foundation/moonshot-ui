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
          />
        </section>
      )}

      {showRawScores && (
        <section>
          <p className="text-[0.8rem]">Raw Scores</p>
          <div className="border border-moongray-700 rounded-lg">
            <table className="w-full text-sm text-left text-moongray-300">
              <thead className="text-xs text-moongray-300">
                <tr className="border-b border-moongray-700">
                  <th
                    scope="col"
                    className="py-3 px-6 border-r border-moongray-700">
                    Dataset
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 border-r border-moongray-700">
                    Prompt Template
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 border-r border-moongray-700">
                    Metric
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipeDetails.map((detail) => (
                  <tr key={detail.dataset_id}>
                    <td className="py-3 px-6 border-r border-moongray-700">
                      {detail.dataset_id}
                    </td>
                    <td className="py-3 px-6 border-r border-moongray-700">
                      {detail.prompt_template_id}
                    </td>
                    <td className="py-3 px-6 border-r border-moongray-700">
                      tbd
                    </td>
                    <td className="py-3 px-6">
                      {detail.metrics.map((m, idx) => (
                        <div key={`${detail.dataset_id}-metric-${idx}`}>
                          {m.accuracy}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}

export { BenchmarkReportRecipeResult };
