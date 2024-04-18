import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const cookbookApi = createApi({
  reducerPath: 'cookbookApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllCookbooks: builder.query<Cookbook[], void>({
      query: () => 'api/v1/cookbooks',
      keepUnusedDataFor: 0,
    }),
    createCookbook: builder.mutation<CookbookFormValues, CookbookFormValues>({
      query: (cookbookInputData) => ({
        url: 'api/v1/cookbooks',
        method: 'POST',
        body: cookbookInputData,
      }),
    }),
  }),
});

const { useGetAllCookbooksQuery, useCreateCookbookMutation } = cookbookApi;

export { cookbookApi, useCreateCookbookMutation, useGetAllCookbooksQuery };
