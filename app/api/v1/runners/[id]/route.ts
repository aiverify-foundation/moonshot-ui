import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let id: string;
  try {
    id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get runner id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}`
  );
  return response;
}
