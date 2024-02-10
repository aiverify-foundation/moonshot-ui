import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const promptTemplateApi = createApi({
  reducerPath: 'promptTemplateApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getPromptTemplates: builder.query<PromptTemplate[], void>({
      query: () => 'api/v1/prompt_templates',
    }),
    usePromptTemplate: builder.mutation<PromptTemplate, string>({
      query: (templateName) => ({
        url: `api/v1/prompt_templates/${templateName}`,
        method: 'PUT',
      }),
    }),
    unusePromptTemplate: builder.mutation<void, string>({
      query: (templateName) => ({
        url: `api/v1/prompt_templates/${templateName}`,
        method: 'DELETE',
      }),
    }),
  }),
});

const {
  useUsePromptTemplateMutation,
  useLazyGetPromptTemplatesQuery,
  useGetPromptTemplatesQuery,
  useUnusePromptTemplateMutation,
} = promptTemplateApi;

export {
  promptTemplateApi,
  useLazyGetPromptTemplatesQuery,
  useUsePromptTemplateMutation,
  useGetPromptTemplatesQuery,
  useUnusePromptTemplateMutation,
};
