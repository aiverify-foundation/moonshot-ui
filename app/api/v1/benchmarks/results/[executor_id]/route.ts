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
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/${result_id}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );
  return response;
}
