import { NextRequest } from 'next/server';
import { basePathBenchmarks, hostURL } from '@/app/api/constants';

export async function GET(request: NextRequest) {
  let executor_id: string;
  try {
    executor_id = request.nextUrl.pathname.split('/')[5];
  } catch (error) {
    return new Response('Unable to get executor id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${hostURL}${basePathBenchmarks}/results/${executor_id}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );
  return response;
}
