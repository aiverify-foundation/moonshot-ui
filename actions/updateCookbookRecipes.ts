'use server';
import config from '@/moonshot.config';

export const updateCookbookRecipes = async ({
  cookbookId,
  recipeIds,
}: {
  cookbookId: string;
  recipeIds: string[];
}): Promise<ActionResponse<string>> => {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}/${cookbookId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipes: recipeIds,
      }),
    }
  );
  const data = await response.json();
  return {
    statusCode: response.status,
    data,
  };
};
