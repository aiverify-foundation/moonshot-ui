import { basePathMetric, hostURL } from '@/app/api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathMetric}`, {
    method: 'GET',
  });
  return response;
}
