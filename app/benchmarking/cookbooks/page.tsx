import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { CookbooksMain } from './cookbooksMain';
export const dynamic = 'force-dynamic';

async function fetchCookbooks() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?count=true`,
    {
      next: {
        tags: ['cookbooks-collection'],
      },
    }
  );
  const result = await processResponse<Cookbook[]>(response);
  return result;
}

export default async function CookbooksPage() {
  const result = await fetchCookbooks();
  if ('error' in result) {
    throw result.error;
  }

  return <CookbooksMain cookbooks={(result as ApiResult<Cookbook[]>).data} />;
}
