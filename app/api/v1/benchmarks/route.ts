import { basePathBenchmarks } from '@/app/api/constants';

const hostURL = process.env.MOONSHOT_API_URL || 'http://localhost:5000';

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
    `${hostURL}${basePathBenchmarks}?type=${queryParams.type}`,
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
