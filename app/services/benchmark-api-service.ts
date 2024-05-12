import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CookbooksBenchmarkResult } from '@/app/views/benchmarking/types/benchmarkReportTypes';
import {
  proxyPathBenchmarksExec,
  proxyPathBenchmarksGetResults,
} from './constants';
import { getHostAndPort } from './host';
import { BenchmarkCollectionType } from '@apptypes/enums';

interface ExtendedBenchmarkRunFormValues {
  benchmarkRunInputData: BenchmarkRunFormValues;
  collectionType: BenchmarkCollectionType;
}

const [host, port] = getHostAndPort();

const benchmarkRunApi = createApi({
  reducerPath: 'benchmarkRunApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    runBenchmark: builder.mutation<
      { id: string },
      ExtendedBenchmarkRunFormValues
    >({
      query: ({ benchmarkRunInputData, collectionType }) => ({
        url: `${proxyPathBenchmarksExec}?type=${collectionType}`,
        method: 'POST',
        body: benchmarkRunInputData,
      }),
    }),
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

const {
  useRunBenchmarkMutation,
  useGetBenchmarksResultQuery,
  useCancelBenchmarkMutation,
} = benchmarkRunApi;

export {
  benchmarkRunApi,
  useRunBenchmarkMutation,
  useGetBenchmarksResultQuery,
  useCancelBenchmarkMutation,
};
