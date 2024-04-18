import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';
import { proxyPathAttackStrategies } from './constants';

const [host, port] = getHostAndPort();

const attackStrategiesApi = createApi({
  reducerPath: 'attackStrategiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllAttackStrategies: builder.query<Dataset[], void>({
      query: () => proxyPathAttackStrategies,
      keepUnusedDataFor: 0
    }),
  }),
});

const { useGetAllAttackStrategiesQuery } = attackStrategiesApi;

export { attackStrategiesApi, useGetAllAttackStrategiesQuery };
