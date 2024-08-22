import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { MLC_COOKBOOK_IDS } from './mlcReportComponents/constants';

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
): CookbookResult[] {
  return benchmarkResult.results.cookbooks.filter((cookbook) =>
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
 * Checks if the benchmark result has the MLC AI Safety cookbook.
 *
 * @param {CookbooksBenchmarkResult} benchmarkResult - The benchmark result containing cookbook data.
 * @returns {boolean} - True if the benchmark result has the MLC AI Safety cookbook, false otherwise.
 */
export function hasMlcAISafetyCookbook(
  benchmarkResult: CookbooksBenchmarkResult
): boolean {
  return benchmarkResult.metadata.cookbooks.includes(MLC_COOKBOOK_IDS[0]);
}
