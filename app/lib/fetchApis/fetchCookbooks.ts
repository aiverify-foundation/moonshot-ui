import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

type urlQueryParams =
  | {
      ids?: string;
      categories?: string;
      categories_excluded?: string;
      tags?: string;
      count?: string;
    }
  | undefined;

type inputParams = {
  ids?: string[];
  categories?: string[];
  categories_excluded?: string[];
  tags?: string[];
  count?: boolean;
};

export async function fetchCookbooks(params?: inputParams) {
  const { ids, categories, categories_excluded, tags, count } = params || {};
  const stringifiedParams: urlQueryParams = params
    ? {
        ...(ids ? { ids: ids.join(',') } : {}),
        ...(categories && categories.length
          ? { categories: categories.join(',') }
          : {}),
        ...(categories_excluded && categories_excluded.length
          ? { categories_excluded: categories_excluded.join(',') }
          : {}),
        ...(tags ? { tags: tags.join(',') } : {}),
        ...(count !== undefined ? { count: count ? 'true' : 'false' } : {}),
      }
    : undefined;
  const urlQueryParams = params
    ? new URLSearchParams(stringifiedParams).toString()
    : undefined;
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?${urlQueryParams}`,
    {
      method: 'GET',
      next: {
        tags: ['cookbooks-collection'],
      },
      cache: 'no-store',
    }
  );
  const result = await processResponse<Cookbook[]>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<Cookbook[]>;
}
