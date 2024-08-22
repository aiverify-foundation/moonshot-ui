import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { BenchmarkCollectionType } from '@/app/types/enums';
import {
  proxyPathBenchmarksExec,
  proxyPathBenchmarksGetResults,
} from './constants';
import { getHostAndPort } from './host';

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
  }),
});

const { useRunBenchmarkMutation, useCancelBenchmarkMutation } = benchmarkRunApi;

export { benchmarkRunApi, useRunBenchmarkMutation, useCancelBenchmarkMutation };
