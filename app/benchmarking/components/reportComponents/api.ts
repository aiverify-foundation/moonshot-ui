import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

export async function fetchRunnerHeading(
  id?: string
): Promise<ApiResult<RunnerHeading> | ErrorWithMessage> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}`
  );
  const result = await processResponse(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<RunnerHeading>;
}

export async function fetchReport(
  id: string
): Promise<ApiResult<CookbooksBenchmarkResult> | ErrorWithMessage> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/${id}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );

  const result = await processResponse<CookbooksBenchmarkResult>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<CookbooksBenchmarkResult>;
}

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
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );
  const result = await processResponse<Cookbook[]>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<Cookbook[]>;
}

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
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );
  const result = await processResponse<Recipe[]>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<Recipe[]>;
}
