import { NextRequest } from 'next/server';

const hostURL = process.env.MOONSHOT_API_URL || 'http://localhost:5000';
const basePath = '/v1/sessions';

export async function POST(request: NextRequest) {
  const { prompt, history_length } = await request.json();
  let session_id: string;
  try {
    session_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get session id from url path', { status: 500 });
  }
  const response = await fetch(`${hostURL}${basePath}/${session_id}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, history_length }),
  });
  return response;
}
