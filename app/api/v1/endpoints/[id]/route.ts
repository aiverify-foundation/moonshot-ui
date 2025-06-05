import { NextRequest } from 'next/server';
import { isValidId } from '@/app/api/v1/apiUtils';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  let id: string;
  try {
    id = request.nextUrl.pathname.split('/')[4];
    if (!isValidId(id)) {
      throw new Error("Invalid endpoint id")
    }
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
      cache: 'no-store',
    }
  );
  return response;
}
