import { fetchCookbooks } from '@/app/lib/fetchApis/fetchCookbooks';
import { ApiResult } from '@/app/lib/http-requests';
import { CookbooksMain } from './cookbooksMain';
export const dynamic = 'force-dynamic';

export default async function CookbooksPage() {
  const result = await fetchCookbooks({ count: true });
  if ('message' in result) {
    throw result;
  }

  return <CookbooksMain cookbooks={(result as ApiResult<Cookbook[]>).data} />;
}
