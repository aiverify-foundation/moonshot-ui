import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathEndpoints } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const llmEndpointApi = createApi({
  reducerPath: 'llmEndpointApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getLLMEndpoints: builder.query<LLMEndpoint[], void>({
      query: () => proxyPathEndpoints,
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
          url: proxyPathEndpoints,
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
          url: `${proxyPathEndpoints}/${id}`,
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
