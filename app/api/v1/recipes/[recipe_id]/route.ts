import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

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
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}/${recipe_id}`,
    {
      method: 'DELETE',
    }
  );
  return response;
}