import { NextRequest } from 'next/server';
import { basePathRecipes, hostURL } from '@/app/api/constants';

const isValidId = (id: string) => {
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id);
};

export async function DELETE(request: NextRequest) {
  let recipe_id: string;
  try {
    recipe_id = request.nextUrl.pathname.split('/')[4];
    if (!isValidId(recipe_id)) {
      throw new Error("Invalid recipe id")
    }
  } catch (error) {
    return new Response('Unable to get recipe id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${hostURL}${basePathRecipes}/${recipe_id}`,
    {
      method: 'DELETE',
    }
  );
  return response;
}