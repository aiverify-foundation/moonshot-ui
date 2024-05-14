import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  let id: string;
  try {
    id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get endpoint id from url path', {
      status: 500,
    });
  }

  const body = await request.json();
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return response;
}
