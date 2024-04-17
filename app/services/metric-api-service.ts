import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathMetrics } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

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
