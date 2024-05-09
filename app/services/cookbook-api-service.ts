import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

type inputParams = {
  ids?: string[];
  categories?: string[];
  categories_excluded?: string[];
  tags?: string[];
  count?: boolean;
};

type urlQueryParams =
  | {
      ids?: string;
      categories?: string;
      categories_excluded?: string;
      tags?: string;
      count?: string;
    }
  | undefined;

const [host, port] = getHostAndPort();
const path = 'api/v1/cookbooks';
const cookbookApi = createApi({
  reducerPath: 'cookbookApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getCookbooks: builder.query<Cookbook[], inputParams | undefined>({
      query: (params) => {
        const { ids, categories, categories_excluded, tags, count } =
          params || {};
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
              ...(count !== undefined
                ? { count: count ? 'true' : 'false' }
                : {}),
            }
          : undefined;
        const urlQueryParams = params
          ? new URLSearchParams(stringifiedParams).toString()
          : undefined;
        return {
          url: urlQueryParams ? `${path}?${urlQueryParams}` : path,
          keepUnusedDataFor: 600,
        };
      },
    }),
    createCookbook: builder.mutation<CookbookFormValues, CookbookFormValues>({
      query: (cookbookInputData) => ({
        url: path,
        method: 'POST',
        body: cookbookInputData,
      }),
    }),
  }),
});

const {
  useGetCookbooksQuery,
  useCreateCookbookMutation,
  useLazyGetCookbooksQuery,
} = cookbookApi;

export {
  cookbookApi,
  useCreateCookbookMutation,
  useGetCookbooksQuery,
  useLazyGetCookbooksQuery,
};
