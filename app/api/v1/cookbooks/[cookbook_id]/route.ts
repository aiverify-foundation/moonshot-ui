import { NextRequest } from 'next/server';
import { basePathCookbooks, hostURL } from '@/app/api/constants';
import { isValidId } from '@/app/api/v1/apiUtils';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  let cookbook_id: string;
  try {
    cookbook_id = request.nextUrl.pathname.split('/')[4];
    if (!isValidId(cookbook_id)) {
      throw new Error("Invalid cookbook id")
    }
  } catch (error) {
    return new Response('Unable to get cookbook id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${hostURL}${basePathCookbooks}/${cookbook_id}`,
    {
      method: 'PUT',
    }
  );
  return response;
}

export async function GET(request: NextRequest) {
  let cookbook_id: string;
  try {
    cookbook_id = request.nextUrl.pathname.split('/')[4];
    if (!isValidId(cookbook_id)) {
      throw new Error("Invalid cookbook id")
    }
  } catch (error) {
    return new Response('Unable to get cookbook id from url path', {
      status: 500,
    });
  }
  const response = await fetch(
    `${hostURL}${basePathCookbooks}/${cookbook_id}?include_history=true`
  );
  return response;
}
