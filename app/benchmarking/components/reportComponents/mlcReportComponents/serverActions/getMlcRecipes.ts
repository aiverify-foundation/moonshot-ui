'use server';

import { fetchRecipes } from '@/app/lib/fetchApis/fetchRecipes';

export async function getMlcRecipes(ids: string[]) {
  const response = await fetchRecipes({ ids });
  if ('message' in response) {
    return {
      status: 'error',
      message: response.message,
    };
  }
  return {
    status: 'success',
    data: response.data,
  };
}
