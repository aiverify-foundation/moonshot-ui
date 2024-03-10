import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const cookbookApi = createApi({
  reducerPath: 'cookbookApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllCookbooks: builder.query<Cookbook[], void>({
      query: () => 'api/v1/cookbooks',
    }),
    createCookbook: builder.mutation<Cookbook, Cookbook>({
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
