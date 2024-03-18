import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathSessions } from './constants';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

type CreateSessionParams = {
  name: string;
  description: string;
  prompt_template?: string;
  context_strategy?: string;
  endpoints: string[];
};

type SendPromptQueryParams = {
  session_id: string;
  prompt: string;
};

const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    createSession: builder.mutation<Session, CreateSessionParams>({
      query: ({
        name,
        description,
        endpoints,
        prompt_template,
        context_strategy,
      }) => ({
        url: proxyPathSessions,
        method: 'POST',
        body: {
          name,
          description,
          endpoints,
          prompt_template,
          context_strategy,
        },
      }),
      transformResponse: (response: { session: Session }) => response.session,
    }),
    getAllSessions: builder.query<Session[], void>({
      query: () => ({ url: proxyPathSessions }),
      keepUnusedDataFor: 0,
    }),
    getSession: builder.query<Session, Session>({
      query: ({ session_id }) => ({
        url: `${proxyPathSessions}/${session_id}`,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: { session: Session }) => response.session,
    }),
    setPromptTemplate: builder.mutation<
      string,
      { session_id: string; templateName: string }
    >({
      query: ({ session_id, templateName }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt_templates/${templateName}`,
        method: 'PUT',
      }),
    }),
    unsetPromptTemplate: builder.mutation<
      void,
      { session_id: string; templateName: string }
    >({
      query: ({ session_id, templateName }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt_templates/${templateName}`,
        method: 'DELETE',
      }),
    }),
    sendPrompt: builder.mutation<ChatHistory, SendPromptQueryParams>({
      query: ({ session_id, prompt }) => ({
        url: `api/v1/sessions/${session_id}/prompt`,
        method: 'POST',
        body: { prompt },
        keepUnusedDataFor: 0,
      }),
      transformResponse: (response: ChatHistory) => response,
    }),
  }),
});

const {
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSetPromptTemplateMutation,
  useUnsetPromptTemplateMutation,
  useSendPromptMutation,
  useCreateSessionMutation,
} = sessionApi;

export {
  sessionApi,
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSendPromptMutation,
  useCreateSessionMutation,
  useSetPromptTemplateMutation,
  useUnsetPromptTemplateMutation,
};
