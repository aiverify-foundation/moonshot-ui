import { basePathBenchmarks } from '@/app/api/constants';

const hostURL = process.env.MOONSHOT_API_URL || 'http://localhost:5000';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathBenchmarks}/results`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return response;
}
