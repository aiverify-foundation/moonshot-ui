import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const path = 'api/v1/cookbooks';
const cookbookApi = createApi({
  reducerPath: 'cookbookApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllCookbooks: builder.query<Cookbook[], void>({
      query: () => path,
      keepUnusedDataFor: 600,
    }),
    getCookbooksByIds: builder.query<Cookbook[], string[]>({
      query: (ids) => `${path}?ids=${ids.join(',')}`,
      keepUnusedDataFor: 600,
    }),
    getSelectedCookbooksMetadata: builder.query<CookbookMetadata, string[]>({
      query: (ids) => `${path}/metadata?ids=${ids.join(',')}`,
      keepUnusedDataFor: 0,
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
  useGetSelectedCookbooksMetadataQuery,
  useCreateCookbookMutation,
} = cookbookApi;

export {
  cookbookApi,
  useCreateCookbookMutation,
  useGetAllCookbooksQuery,
  useGetCookbooksByIdsQuery,
  useGetSelectedCookbooksMetadataQuery,
};
