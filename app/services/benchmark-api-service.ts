import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
      BenchmarkRunFormValues,
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
      BenchmarkResultsFormat,
      { benchmarkId: string }
    >({
      query: ({ benchmarkId }) => ({
        url: `${proxyPathBenchmarksGetResults}/${benchmarkId}`,
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
