import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathRunners } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

const runnerApi = createApi({
  reducerPath: 'runnerApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllRunners: builder.query<Runner[], void>({
      query: () => proxyPathRunners,
      keepUnusedDataFor: 0,
    }),
    getRunnerById: builder.query<
      Runner,
      { id?: string | null; additionalDetails?: boolean }
    >({
      query: ({ id, additionalDetails }) =>
        `${proxyPathRunners}/${id}${additionalDetails ? '?rundata=true' : ''}`,
      keepUnusedDataFor: 600,
    }),
  }),
});

const { useGetRunnerByIdQuery, useGetAllRunnersQuery } = runnerApi;

export { runnerApi, useGetRunnerByIdQuery, useGetAllRunnersQuery };
