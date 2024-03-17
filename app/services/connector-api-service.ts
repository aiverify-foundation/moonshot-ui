import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathConnectors } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const connectorApi = createApi({
  reducerPath: 'connectorApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllConnectors: builder.query<string[], void>({
      query: () => proxyPathConnectors,
    }),
  }),
});

const { useGetAllConnectorsQuery } = connectorApi;

export { connectorApi, useGetAllConnectorsQuery };
