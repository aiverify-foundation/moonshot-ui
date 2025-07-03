import { NextRequest } from 'next/server';
import { basePathRecipes, hostURL } from '@/app/api/constants';

export async function DELETE(request: NextRequest) {
  let recipe_id: string;
  try {
    recipe_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get template name from url path', {
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