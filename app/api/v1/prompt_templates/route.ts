import { basePathPromptTemplates, hostURL } from '@api/constants';

export const dynamic = 'force-dynamic';
export async function GET() {
  const response = await fetch(
    `${hostURL}${basePathPromptTemplates}`,
    {
      method: 'GET',
    }
  );
  return response;
}
