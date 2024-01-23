import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

type CreateSessionParams = {
  name: string;
  description: string;
  endpoints: string[];
};

type SendPromptQueryParams = {
  session_id: string;
  prompt: string;
  include_history?: boolean;
  history_length?: number;
};

const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    createSession: builder.mutation<Session, CreateSessionParams>({
      query: ({ name, description, endpoints }) => ({
        url: 'api/v1/sessions',
        method: 'POST',
        body: { name, description, endpoints },
      }),
      transformResponse: (response: { session: Session }) => response.session,
    }),
    getAllSessions: builder.query<Session[], void>({
      query: () => ({ url: 'api/v1/sessions' }),
    }),
    getSession: builder.query<Session, Session>({
      query: ({ session_id }) => ({ url: `api/v1/sessions/${session_id}` }),
      transformResponse: (response: { session: Session }) => response.session,
    }),
    setActiveSession: builder.query<Session, string>({
      query: (session_id) => ({ url: `api/v1/sessions/${session_id}`, method: 'PUT' }),
      transformResponse: (response: { session: Session }) => response.session,
    }),
    sendPrompt: builder.mutation<ChatHistory, SendPromptQueryParams>({
      query: ({ session_id, prompt, include_history = true, history_length = 50 }) => ({
        url: `api/v1/sessions/${session_id}/prompt?include_history=${include_history}&length=${history_length}`,
        method: 'POST',
        body: { prompt },
      }),
      transformResponse: (response: ChatHistory) => response,
    }),
  }),
});

const {
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSendPromptMutation,
  useCreateSessionMutation,
  useLazySetActiveSessionQuery,
} = sessionApi;

export {
  sessionApi,
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSendPromptMutation,
  useCreateSessionMutation,
  useLazySetActiveSessionQuery,
};
