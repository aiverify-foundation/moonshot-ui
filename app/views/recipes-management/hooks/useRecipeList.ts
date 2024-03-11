import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';

export function useRecipeList() {
  const { data, error, isLoading, refetch } = useGetAllRecipesQuery();
  let recipes: Recipe[] = [];
  if (data !== undefined) {
    recipes = data;
  }
  return { recipes, error, isLoading, refetch };
}
