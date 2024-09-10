import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import {
  proxyPathBenchmarksExec,
  proxyPathBenchmarksGetResults,
} from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

const benchmarkRunApi = createApi({
  reducerPath: 'benchmarkRunApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    cancelBenchmark: builder.mutation<void, string>({
      query: (runnerId) => ({
        url: `${proxyPathBenchmarksExec}/cancel/${runnerId}`,
        method: 'POST',
      }),
    }),
    getBenchmarksResult: builder.query<
      CookbooksBenchmarkResult,
      { id?: string }
    >({
      query: ({ id }) => ({
        url: `${proxyPathBenchmarksGetResults}/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

const { useGetBenchmarksResultQuery, useCancelBenchmarkMutation } =
  benchmarkRunApi;

export {
  benchmarkRunApi,
  useGetBenchmarksResultQuery,
  useCancelBenchmarkMutation,
};
