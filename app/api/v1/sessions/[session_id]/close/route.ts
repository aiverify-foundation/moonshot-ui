import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let session_id: string;
  try {
    session_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get session id', {
      status: 500,
    });
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/close`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
