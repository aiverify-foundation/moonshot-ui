import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathContextStrats } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const contextStratApi = createApi({
  reducerPath: 'contextStratApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllContextStrategies: builder.query<string[], void>({
      query: () => proxyPathContextStrats,
      keepUnusedDataFor: 0,
    }),
  }),
});

const { useGetAllContextStrategiesQuery } = contextStratApi;

export { contextStratApi, useGetAllContextStrategiesQuery };
