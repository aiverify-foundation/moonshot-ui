import { basePathRecipes, hostURL } from '@api/constants';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathRecipes}`, {
    method: 'GET',
  });
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${hostURL}${basePathRecipes}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}
