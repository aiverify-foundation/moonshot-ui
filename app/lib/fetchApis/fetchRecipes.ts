import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

type recipesInputParams = {
  ids?: string[];
  categories?: string[];
  tags?: string[];
  count?: boolean;
};

type recipesUrlQueryParams =
  | {
      ids?: string;
      categories?: string;
      tags?: string;
      count?: string;
    }
  | undefined;

export async function fetchRecipes(params?: recipesInputParams) {
  const { ids, categories, tags, count } = params || {};
  const stringifiedParams: recipesUrlQueryParams = params
    ? {
        ...(ids ? { ids: ids.join(',') } : {}),
        ...(categories ? { categories: categories.join(',') } : {}),
        ...(tags ? { tags: tags.join(',') } : {}),
        ...(count !== undefined ? { count: count ? 'true' : 'false' } : {}),
      }
    : undefined;
  const urlQueryParams = params
    ? new URLSearchParams(stringifiedParams).toString()
    : undefined;
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?${urlQueryParams}`,
    {
      cache: 'no-store',
    }
  );
  const result = await processResponse<Recipe[]>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<Recipe[]>;
}
