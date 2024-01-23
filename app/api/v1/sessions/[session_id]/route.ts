import { NextRequest } from 'next/server';

const hostURL = process.env.MOONSHOT_API_URL || 'http://localhost:5000';
const basePath = '/v1/sessions';

export async function GET(request: NextRequest) {
  let session_id: string;
  try {
    session_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get session id from url path', { status: 500 });
  }
  const response = await fetch(`${hostURL}${basePath}/${session_id}?include_history=true`);
  return response;
}

export async function PUT(request: NextRequest) {
  let session_id: string;
  try {
    session_id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get session id from url path', { status: 500 });
  }
  const body = await request.json();
  const response = await fetch(`${hostURL}${basePath}/${session_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}
