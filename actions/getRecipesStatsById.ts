'use server';

import { fetchRecipes } from '@/app/lib/fetchApis/fetchRecipes';

type GetRecipesStatsByIdResult =
  | {
      status: 'success';
      data: RecipeStats[];
    }
  | {
      status: 'error';
      message: string;
    };

export async function getRecipesStatsById(
  ids: string[]
): Promise<GetRecipesStatsByIdResult> {
  const result = await fetchRecipes({ ids, count: true });
  // result type could be union type with Error class.
  // classes are not serializable to be passed to client components. So handle that here.
  if ('message' in result) {
    return {
      status: 'error',
      message: result.message,
    };
  }
  return {
    status: 'success',
    data: result.data.reduce((acc, recipe) => {
      acc.push(recipe.stats);
      return acc;
    }, [] as RecipeStats[]),
  };
}
