import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathMetrics } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

const metricApi = createApi({
  reducerPath: 'metricApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllMetrics: builder.query<Dataset[], void>({
      query: () => proxyPathMetrics,
      keepUnusedDataFor: 0
    }),
  }),
});

const { useGetAllMetricsQuery } = metricApi;

export { metricApi, useGetAllMetricsQuery };
