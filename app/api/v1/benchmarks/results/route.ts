import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const resultdata = searchParams.get('resultdata');
  let url = `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results`;
  if (resultdata === 'false') {
    url = `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/name`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return response;
}
