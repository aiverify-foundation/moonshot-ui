import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export async function GET(request: NextRequest) {
  let result_id: string;
  try {
    result_id = request.nextUrl.pathname.split('/')[5];
  } catch (error) {
    return new Response('Unable to get result id from url path', {
      status: 500,
    });
  }

  const download = request.nextUrl.searchParams.get('download') === 'true';

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/${result_id}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );

  if (!response.ok) {
    return new Response('Failed to fetch data', { status: response.status });
  }

  if (!download) {
    return response;
  }

  const data = await response.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Content-Disposition': 'attachment; filename="result.json"',
  });
  return new Response(blob, { headers });
}
