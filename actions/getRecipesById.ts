'use server';

import { fetchRecipes } from '@/app/lib/fetchApis/fetchRecipes';

type GetRecipesByIdResult =
  | {
      status: 'success';
      data: Recipe[];
    }
  | {
      status: 'error';
      message: string;
    };

export async function getRecipesById(
  ids: string[]
): Promise<GetRecipesByIdResult> {
  const result = await fetchRecipes({ ids, count: false });
  if ('message' in result) {
    return {
      status: 'error',
      message: result.message,
    };
  }
  return {
    status: 'success',
    data: result.data,
  };
}
