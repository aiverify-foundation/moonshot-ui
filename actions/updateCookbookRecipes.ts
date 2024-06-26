'use server';
import config from '@/moonshot.config';

const delay = (max = 2500) => {
  const randomDelayTime = Math.floor(Math.random() * (max - 500 + 1));
  return new Promise((resolve) => setTimeout(resolve, randomDelayTime));
};

export const updateCookbookRecipes = async ({
  cookbookId,
  recipeIds,
}: {
  cookbookId: string;
  recipeIds: string[];
}) => {
  await delay(3000);
  console.log('cookbookId', cookbookId);
  console.log('recipeIds', recipeIds);
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
  console.log('response', response);
  const data = await response.json();
  console.log('data', data);
  return data;
};
