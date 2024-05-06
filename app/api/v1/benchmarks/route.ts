import config from '@/moonshot.config';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);
  if (queryParams.type === undefined) {
    return new Response(
      JSON.stringify({ error: 'Missing query parameter: type' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  const body = await request.json();
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}?type=${queryParams.type}`,
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
