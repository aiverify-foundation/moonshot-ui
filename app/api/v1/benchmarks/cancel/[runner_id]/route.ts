import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let runner_id: string;
  try {
    runner_id = request.nextUrl.pathname.split('/')[5];
  } catch (error) {
    return new Response('Unable to get runner id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/cancel/${runner_id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
