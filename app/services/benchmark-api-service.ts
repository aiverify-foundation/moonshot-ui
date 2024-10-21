import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathBenchmarksExec } from './constants';
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
  }),
});

const { useCancelBenchmarkMutation } = benchmarkRunApi;

export { benchmarkRunApi, useCancelBenchmarkMutation };
