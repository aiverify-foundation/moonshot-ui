'use server';
import config from '@/moonshot.config';

export const updateRecipeDataset = async ({
  recipeId,
  datasetIds,
}: {
  recipeId: string;
  datasetIds: string[];
}) => {
  const payload = JSON.stringify({
    datasets: datasetIds,
  });
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}/${recipeId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    }
  );
  const data = await response.json();
  return {
    statusCode: response.status,
    data,
  };
};
