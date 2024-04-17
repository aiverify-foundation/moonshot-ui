import { basePathMetric, hostURL } from '@api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathMetric}`, {
    method: 'GET',
  });
  return response;
}
