import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const idsParam = request.nextUrl.searchParams.get('ids');
  const categoriesParam = request.nextUrl.searchParams.get('categories');
  const countParam = request.nextUrl.searchParams.get('count');
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?${categoriesParam ? `categories=${categoriesParam}` : ''}&count=${countParam ? countParam : false}`,
    {
      method: 'GET',
    }
  );

  if (!idsParam) {
    return response;
  }
  const data = (await response.json()) as Cookbook[];
  const ids = idsParam.split(',').map((id) => id.trim());
  const filteredData = data.filter((cookbook) => ids.includes(cookbook.id));
  return new Response(JSON.stringify(filteredData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
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
