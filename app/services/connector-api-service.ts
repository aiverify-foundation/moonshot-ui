import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathConnectors } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const connectorApi = createApi({
  reducerPath: 'connectorApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllConnectors: builder.query<string[], void>({
      query: () => proxyPathConnectors,
      keepUnusedDataFor: 0,
    }),
  }),
});

const { useGetAllConnectorsQuery } = connectorApi;

export { connectorApi, useGetAllConnectorsQuery };
