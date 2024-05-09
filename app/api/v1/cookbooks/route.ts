import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?${request.nextUrl.searchParams}`
  );
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}`,
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
