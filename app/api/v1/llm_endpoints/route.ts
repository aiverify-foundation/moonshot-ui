import { basePathLLMEndpoints, hostURL } from '@api/constants';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathLLMEndpoints}`, {
    method: 'GET',
  });
  return response;
}
