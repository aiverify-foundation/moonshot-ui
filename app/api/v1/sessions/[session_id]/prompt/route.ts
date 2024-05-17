import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  let session_id: string;
  try {
    session_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get session id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/prompt`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  return response;
}
