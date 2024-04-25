import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

const mockResponse = {
  totalPrompts: 425196,
  estTotalPromptResponseTime: 39688,
};

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  if (!idsParam) {
    return new Response('Missing required query parameter: ids', {
      status: 400,
    });
  }

  const ids = idsParam.split(',').map((id) => parseInt(id.trim()));
  if (ids.length === 0) {
    return new Response('Missing required query parameters: ids', {
      status: 400,
    });
  }

  try {
    // const metadata = await fetchMetadataByIds(ids);
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
    });
  } catch (error) {
    return new Response('Error fetching metadata', {
      status: 500,
    });
  }
}

async function fetchMetadataByIds(ids: number[]) {
  // This function should interact with the database or another service to retrieve metadata
  // Placeholder for  service call
  return ids.map((id) => ({ id, metadata: `Metadata for id ${id}` }));
}
