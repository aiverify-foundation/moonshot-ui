import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathDatasets } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

const datasetApi = createApi({
  reducerPath: 'datasetApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllDataset: builder.query<Dataset[], void>({
      query: () => proxyPathDatasets,
      keepUnusedDataFor: 0
    }),
  }),
});

const { useGetAllDatasetQuery } = datasetApi;

export { datasetApi, useGetAllDatasetQuery };
