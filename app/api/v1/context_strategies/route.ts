import { basePathContextStrategies, hostURL } from '@api/constants';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathContextStrategies}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return response;
}
