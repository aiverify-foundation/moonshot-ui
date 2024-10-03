import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${config.webAPI.hostURL}${config.webAPI.basePathMetrics}`, {
    method: 'GET',
  });
  return response;
}
