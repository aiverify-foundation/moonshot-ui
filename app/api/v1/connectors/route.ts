import { basePathConnectors, hostURL } from '@api/constants';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathConnectors}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return response;
}
