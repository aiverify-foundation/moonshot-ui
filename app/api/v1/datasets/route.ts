import { basePathDatasets, hostURL } from '@/app/api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathDatasets}`, {
    method: 'GET',
  });
  return response;
}
