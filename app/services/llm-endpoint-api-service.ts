import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const llmEndpointApi = createApi({
  reducerPath: 'llmEndpointApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getLLMEndpoints: builder.query<LLMEndpoint[], void>({
      query: () => 'api/v1/llm_endpoints',
    }),
    createLLMEndpoint: builder.mutation<LLMEndpoint, LLMEndpoint>({
      query: (endpointDetails) => ({
        url: 'api/v1/llm_endpoints',
        method: 'POST',
        body: endpointDetails,
      }),
    }),
  }),
});

const {
  useGetLLMEndpointsQuery,
  useCreateLLMEndpointMutation,
  useLazyGetLLMEndpointsQuery,
} = llmEndpointApi;

export {
  llmEndpointApi,
  useGetLLMEndpointsQuery,
  useCreateLLMEndpointMutation,
};
