import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { CookbooksViewList } from '@/app/views/cookbook-management/cookbooksViewList';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchCookbooks() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?count=true`,
    { cache: 'no-store' }
  );
  const result = await processResponse<Cookbook[]>(response);
  return result;
}

export default async function CookbooksPage() {
  const result = await fetchCookbooks();
  if ('error' in result) {
    throw result.error;
  }

  return (
    <CookbooksViewList cookbooks={(result as ApiResult<Cookbook[]>).data} />
  );
}
