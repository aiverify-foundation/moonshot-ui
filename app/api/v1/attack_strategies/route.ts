import { basePathAttackStrategies, hostURL } from '@api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathAttackStrategies}`, {
    method: 'GET',
  });
  return response;
}
