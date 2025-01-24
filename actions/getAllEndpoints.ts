'use server';

import { fetchEndpoints } from '@/app/lib/fetchApis/fetchEndpoint';

type GetAllEndpointsResult =
  | {
      status: 'success';
      data: LLMEndpoint[];
    }
  | {
      status: 'error';
      message: string;
    };

export async function getAllEndpoints(): Promise<GetAllEndpointsResult> {
  const result = await fetchEndpoints();
  if ('message' in result) {
    return {
      status: 'error',
      message: result.message,
    };
  }
  return { status: 'success', data: result.data };
}
