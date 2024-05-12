import { CookbooksBenchmarkResult } from '@/app/views/benchmarking/types/benchmarkReportTypes';

export function calcTotalPromptsByEndpoint(
  result: CookbooksBenchmarkResult,
  endpointId: string
): number {
  let totalPrompts = 0;

  // Iterate through each cookbook in the results
  result.results.cookbooks.forEach((cookbook) => {
    // Iterate through each recipe in the cookbook
    cookbook.recipes.forEach((recipe) => {
      // Iterate through each evaluation summary in the recipe
      recipe.evaluation_summary.forEach((summary) => {
        // Check if the model_id matches the endpointId
        if (summary.model_id === endpointId) {
          // Add the number of prompts for this model to the total
          totalPrompts += summary.num_of_prompts;
        }
      });
    });
  });

  return totalPrompts;
}
