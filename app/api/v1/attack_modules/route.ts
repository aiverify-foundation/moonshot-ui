import { basePathAttackModules, hostURL } from '@api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathAttackModules}`, {
    method: 'GET',
  });
  return response;
}
