import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let id: string;
  const searchParams = request.nextUrl.searchParams;
  const rundata = searchParams.get('rundata');
  try {
    id = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get runner id from url path', {
      status: 500,
    });
  }

  if (!rundata || rundata.toLowerCase() !== 'true') {
    const response = await fetch(
      `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}`
    );
    return response;
  }

  const response = await Promise.all([
    fetch(`${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}`),
    fetch(
      `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}/runs/1`
    ),
  ]);
  const [runnerResponse, runnerDetailsResponse] = response;
  const runnerData = await runnerResponse.json();
  const runnerDetailsData = await runnerDetailsResponse.json();
  const mergedResponse = {
    ...runnerData,
    ...runnerDetailsData,
    database_file: undefined,
  };
  return new Response(JSON.stringify(mergedResponse), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
