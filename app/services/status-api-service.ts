import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathBenchmarksGetStatus } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllStatus: builder.query<TestStatuses, void>({
      query: () => proxyPathBenchmarksGetStatus,
    }),
  }),
});

const { useGetAllStatusQuery } = statusApi;

export { statusApi, useGetAllStatusQuery };
