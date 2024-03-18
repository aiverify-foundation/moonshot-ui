import { basePathCookbooks, hostURL } from '@api/constants';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathCookbooks}`, {
    method: 'GET',
  });
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${hostURL}${basePathCookbooks}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}
