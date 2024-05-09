import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams;
  const queryParams = urlParams
    ? new URLSearchParams(urlParams).toString()
    : '';
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?${queryParams}`,
    {
      method: 'GET',
    }
  );
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return response;
}
