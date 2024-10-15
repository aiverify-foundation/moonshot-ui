import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/report/types/benchmarkReportTypes';

/**
 * Extracts cookbook results from the benchmark result based on the provided cookbook IDs.
 *
 * @param {CookbooksBenchmarkResult} benchmarkResult - The benchmark result containing cookbook data.
 * @param {string[]} cookbookIds - An array of cookbook IDs to filter the results.
 * @returns {CookbookResult[]} - An array of filtered cookbook results.
 */
export function extractCookbookResults(
  benchmarkResult: CookbooksBenchmarkResult,
  cookbookIds: string[]
): CookbookResult | undefined {
  return benchmarkResult.results.cookbooks.find((cookbook) =>
    cookbookIds.includes(cookbook.id)
  );
}

/**
 * Extracts recipe IDs from an array of cookbook results.
 *
 * @param {CookbookResult[]} cookbookResults - An array of cookbook results.
 * @returns {string[]} - An array of recipe IDs.
 */
export function extractRecipeIds(cookbookResults: CookbookResult[]): string[] {
  return cookbookResults.flatMap((cookbook) =>
    cookbook.recipes.map((recipeResult) => recipeResult.id)
  );
}

/**
 * Checks if the benchmark result contains a specific cookbook.
 *
 * @param {string} cookbookId - The ID of the cookbook to check for.
 * @param {CookbooksBenchmarkResult} benchmarkResult - The benchmark result containing cookbook data.
 * @returns {boolean} - True if the benchmark result contains the specified cookbook, false otherwise.
 */
export function hasSpecificCookbook(
  cookbookId: string,
  benchmarkResult: CookbooksBenchmarkResult
): boolean {
  return benchmarkResult.metadata.cookbooks.includes(cookbookId);
}

/**
 * Checks if the benchmark result contains any of the specified recipes.
 *
 * @param {string[]} recipeIds - An array of recipe IDs to check for.
 * @param {CookbooksBenchmarkResult} benchmarkResult - The benchmark result containing cookbook data.
 * @returns {boolean} - True if the benchmark result contains any of the specified recipes, false otherwise.
 */
export function hasAnyOfSpecificRecipes(
  recipeIds: string[],
  benchmarkResult: CookbooksBenchmarkResult
): boolean {
  return benchmarkResult.results.cookbooks.some((cookbook) =>
    cookbook.recipes.some((recipe) => recipeIds.includes(recipe.id))
  );
}

/**
 * Filters recipes by a specific ID.
 *
 * @param {Recipe[]} recipes - An array of recipe results.
 * @param {string[]} recipeIds - An array of recipe IDs to filter by.
 * @returns {Recipe[]} - An array of recipes by the specified IDs.
 */
export function filterRecipes(
  recipes: Recipe[],
  recipeIds: string[]
): Recipe[] {
  return recipes.filter((recipe) => recipeIds.includes(recipe.id));
}
