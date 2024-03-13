import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const benchmarkRunApi = createApi({
  reducerPath: 'benchmarkRunApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    runBenchmark: builder.mutation<
      BenchmarkRunFormValues,
      BenchmarkRunFormValues
    >({
      query: (benchmarkRunInputData) => ({
        url: 'api/v1/execute/cookbook',
        method: 'POST',
        body: benchmarkRunInputData,
      }),
    }),
  }),
});

const { useRunBenchmarkMutation } = benchmarkRunApi;

export { benchmarkRunApi, useRunBenchmarkMutation };
