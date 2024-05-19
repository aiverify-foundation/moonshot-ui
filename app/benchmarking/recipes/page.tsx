import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { RecipesViewList } from '@/app/views/recipes-management/recipesViewList';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchRecipes() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?count=true`
  );
  const result = await processResponse<Recipe[]>(response);
  return result;
}

export default async function RecipesPage() {
  const result = await fetchRecipes();
  if ('error' in result) {
    throw result.error;
  }

  return <RecipesViewList recipes={(result as ApiResult<Recipe[]>).data} />;
}
