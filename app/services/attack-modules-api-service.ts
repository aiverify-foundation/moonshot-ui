import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';
import { proxyPathAttackModules } from './constants';

const [host, port] = getHostAndPort();

const attackModulesApi = createApi({
  reducerPath: 'attackModulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllAttackModules: builder.query<Dataset[], void>({
      query: () => proxyPathAttackModules,
      keepUnusedDataFor: 0
    }),
  }),
});

const { useGetAllAttackModulesQuery } = attackModulesApi;

export { attackModulesApi, useGetAllAttackModulesQuery };
