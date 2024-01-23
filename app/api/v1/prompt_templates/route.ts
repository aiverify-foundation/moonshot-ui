import { basePathPromptTemplates, hostURL } from '../../constants';

export async function GET() {
  const response = await fetch(`${hostURL}${basePathPromptTemplates}`, {
    method: 'GET',
  });
  return response;
}
