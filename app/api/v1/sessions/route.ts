import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}`,
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

export async function GET() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}`
  );
  return response;
}
