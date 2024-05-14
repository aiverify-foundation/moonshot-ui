import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const llmEndpointApi = createApi({
  reducerPath: 'llmEndpointApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getLLMEndpoints: builder.query<LLMEndpoint[], void>({
      query: () => 'api/v1/llm_endpoints',
      keepUnusedDataFor: 0,
    }),
    createLLMEndpoint: builder.mutation<
      LLMEndpointFormValues,
      LLMEndpointFormValues
    >({
      query: (endpointDetails) => {
        let body: LLMEndpointFormValues;
        try {
          body =
            endpointDetails.params != undefined
              ? {
                  ...endpointDetails,
                  params: JSON.parse(endpointDetails.params),
                }
              : endpointDetails;
        } catch (e) {
          console.error(e);
          body = endpointDetails;
        }
        return {
          url: 'api/v1/llm_endpoints',
          method: 'POST',
          body,
        };
      },
    }),
    updateLLMEndpoint: builder.mutation<
      LLMEndpointFormValues,
      { id: string; endpointDetails: LLMEndpointFormValues }
    >({
      query: ({ id, endpointDetails }) => {
        let body: LLMEndpointFormValues;
        try {
          body =
            endpointDetails.params != undefined
              ? {
                  ...endpointDetails,
                  params: JSON.parse(endpointDetails.params),
                }
              : endpointDetails;
        } catch (e) {
          console.error(e);
          body = endpointDetails;
        }
        return {
          url: `api/v1/llm_endpoints/${id}`,
          method: 'PUT',
          body,
        };
      },
    }),
  }),
});

const {
  useGetLLMEndpointsQuery,
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
} = llmEndpointApi;

export {
  llmEndpointApi,
  useGetLLMEndpointsQuery,
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
};
