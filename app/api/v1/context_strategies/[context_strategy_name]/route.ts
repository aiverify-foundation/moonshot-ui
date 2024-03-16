import { NextRequest } from 'next/server';
import { basePathContextStrategies, hostURL } from '@/app/api/constants';

export async function PUT(request: NextRequest) {
  let strategyName: string;
  try {
    strategyName = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response(
      'Unable to get context strategy parameter from url path',
      {
        status: 400,
      }
    );
  }
  const response = await fetch(
    `${hostURL}${basePathContextStrategies}/${strategyName}`,
    {
      method: 'PUT',
    }
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  let strategyName: string;
  try {
    strategyName = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response(
      'Unable to get context strategy parameter from url path',
      {
        status: 400,
      }
    );
  }
  const response = await fetch(
    `${hostURL}${basePathContextStrategies}/${strategyName}`,
    {
      method: 'DELETE',
    }
  );
  return response;
}
