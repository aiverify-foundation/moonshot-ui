import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathBenchmarksGetStatus } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllStatus: builder.query<TestStatuses, void>({
      query: () => proxyPathBenchmarksGetStatus,
      keepUnusedDataFor: 0,
    }),
  }),
});

const { useGetAllStatusQuery } = statusApi;

export { statusApi, useGetAllStatusQuery };
