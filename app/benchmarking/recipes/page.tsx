import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchRecipes() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?count=true`
  );
  const result = await processResponse<Recipe[]>(response);
  return result;
}

async function fetchCookbooks() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?count=true`,
    { cache: 'no-store' }
  );
  const result = await processResponse<Cookbook[]>(response);
  return result;
}

export default async function RecipesPage() {
  const rcResult = await fetchRecipes();
  if ('error' in rcResult) {
    throw rcResult.error;
  }

  const cbResult = await fetchCookbooks();
  if ('error' in cbResult) {
    throw cbResult.error;
  }

  return (
    <RecipesViewList
      recipes={(rcResult as ApiResult<Recipe[]>).data}
      cookbooks={(cbResult as ApiResult<Cookbook[]>).data}
    />
  );
}
