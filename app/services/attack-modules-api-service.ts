import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathAttackModules } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

const attackModulesApi = createApi({
  reducerPath: 'attackModulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllAttackModules: builder.query<AttackModule[], void>({
      query: () => proxyPathAttackModules,
      keepUnusedDataFor: 0,
    }),
  }),
});

const { useGetAllAttackModulesQuery } = attackModulesApi;

export { attackModulesApi, useGetAllAttackModulesQuery };
