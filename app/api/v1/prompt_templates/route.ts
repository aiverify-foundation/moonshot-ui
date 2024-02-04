import { basePathPromptTemplates, hostURL } from '@api/constants';

export async function GET() {
  const response = await fetch(
    `${hostURL}${basePathPromptTemplates}`,
    {
      method: 'GET',
    }
  );
  return response;
}
