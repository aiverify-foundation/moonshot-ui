import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams;
  const ids = urlParams.get('recipe_id');
  const response = await fetch(`${config.webAPI.hostURL}${config.webAPI.basePathRecipes}${ids ? `?recipe_id=${ids}` : ''}`, {
    method: 'GET',
  });
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${config.webAPI.hostURL}${config.webAPI.basePathRecipes}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}
