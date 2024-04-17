import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathAttackStrategies } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

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
