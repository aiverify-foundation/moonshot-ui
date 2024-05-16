import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const promptTemplateApi = createApi({
  reducerPath: 'promptTemplateApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getPromptTemplates: builder.query<PromptTemplate[], void>({
      query: () => 'api/v1/prompt-templates',
      keepUnusedDataFor: 600,
    }),
  }),
});

const { useLazyGetPromptTemplatesQuery, useGetPromptTemplatesQuery } =
  promptTemplateApi;

export {
  promptTemplateApi,
  useLazyGetPromptTemplatesQuery,
  useGetPromptTemplatesQuery,
};
