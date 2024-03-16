import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  proxyPathBenchmarksExec,
  proxyPathBenchmarksGetResults,
} from './constants';
import { BenchmarkCollectionType } from '@apptypes/enums';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

interface ExtendedBenchmarkRunFormValues {
  benchmarkRunInputData: BenchmarkRunFormValues;
  collectionType: BenchmarkCollectionType;
}

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

const { useRunBenchmarkMutation, useGetBenchmarksResultQuery } =
  benchmarkRunApi;

export {
  benchmarkRunApi,
  useRunBenchmarkMutation,
  useGetBenchmarksResultQuery,
};
