import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

type urlParams = {
  ids?: string[];
  categories?: string;
  count?: boolean;
};

const [host, port] = getHostAndPort();
const path = 'api/v1/cookbooks';
const cookbookApi = createApi({
  reducerPath: 'cookbookApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllCookbooks: builder.query<Cookbook[], urlParams>({
      query: ({ categories, count = false }) =>
        `${path}?${categories ? `categories=${categories}` : ''}&count=${count}`,
      keepUnusedDataFor: 600,
    }),
    getCookbooksByIds: builder.query<Cookbook[], urlParams>({
      query: ({ ids, count = false }) =>
        `${path}?${ids ? `ids=${ids.join(',')}` : ''}&count=${count}`,
      keepUnusedDataFor: 600,
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
  useGetAllCookbooksQuery,
  useGetCookbooksByIdsQuery,
  useCreateCookbookMutation,
  useLazyGetAllCookbooksQuery,
  useLazyGetCookbooksByIdsQuery,
} = cookbookApi;

export {
  cookbookApi,
  useCreateCookbookMutation,
  useGetAllCookbooksQuery,
  useGetCookbooksByIdsQuery,
  useLazyGetAllCookbooksQuery,
  useLazyGetCookbooksByIdsQuery,
};
