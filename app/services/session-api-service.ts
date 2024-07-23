import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { proxyPathSessions } from './constants';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();

type SendPromptQueryParams = {
  session_id: string;
  prompt: string;
};

const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    createSession: builder.mutation<SessionData, RedteamRunFormValues>({
      query: ({ name, description, endpoints, attack_module }) => ({
        url: proxyPathSessions,
        method: 'POST',
        body: {
          name,
          description,
          endpoints,
          attack_module,
        },
      }),
    }),
    getAllSessions: builder.query<SessionData[], void>({
      query: () => ({ url: proxyPathSessions }),
      keepUnusedDataFor: 0,
    }),
    getSession: builder.query<Session, { session_id: string }>({
      query: ({ session_id }) => ({
        url: `${proxyPathSessions}/${session_id}`,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: { session: Session }) => response.session,
    }),
    closeSession: builder.mutation<
      { success: boolean },
      { session_id: string }
    >({
      query: ({ session_id }) => ({
        url: `${proxyPathSessions}/${session_id}/close`,
        method: 'GET',
      }),
    }),
    setPromptTemplate: builder.mutation<
      { success: boolean },
      { session_id: string; templateName: string }
    >({
      query: ({ session_id, templateName }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt-template/${templateName}`,
        method: 'PUT',
      }),
    }),
    unsetPromptTemplate: builder.mutation<
      { success: boolean },
      { session_id: string; templateName: string }
    >({
      query: ({ session_id, templateName }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt-template/${templateName}`,
        method: 'DELETE',
      }),
    }),
    setAttackModule: builder.mutation<
      { success: boolean },
      { session_id: string; attack_id: string }
    >({
      query: ({ session_id, attack_id }) => ({
        url: `${proxyPathSessions}/${session_id}/attack-module/${attack_id}`,
        method: 'PUT',
      }),
    }),
    unsetAttackModule: builder.mutation<
      { success: boolean },
      { session_id: string; attack_id: string }
    >({
      query: ({ session_id, attack_id }) => ({
        url: `${proxyPathSessions}/${session_id}/attack-module/${attack_id}`,
        method: 'DELETE',
      }),
    }),
    setContextStrategy: builder.mutation<
      { success: boolean },
      { session_id: string; strategyName: string; numOfPrevPrompts: number }
    >({
      query: ({ session_id, strategyName, numOfPrevPrompts }) => ({
        url: `${proxyPathSessions}/${session_id}/context-strategy/${strategyName}/${numOfPrevPrompts}`,
        method: 'PUT',
      }),
    }),
    unsetContextStrategy: builder.mutation<
      { success: boolean },
      { session_id: string; strategyName: string; numOfPrevPrompts: number }
    >({
      query: ({ session_id, strategyName, numOfPrevPrompts }) => ({
        url: `${proxyPathSessions}/${session_id}/context-strategy/${strategyName}/${numOfPrevPrompts}`,
        method: 'DELETE',
      }),
    }),
    sendPrompt: builder.mutation<
      ManualPromptResponseData,
      SendPromptQueryParams
    >({
      query: ({ session_id, prompt }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt`,
        method: 'POST',
        body: { user_prompt: prompt },
        keepUnusedDataFor: 0,
      }),
    }),
    sendArtPrompt: builder.mutation<string, SendPromptQueryParams>({
      query: ({ session_id, prompt }) => ({
        url: `${proxyPathSessions}/${session_id}/prompt`,
        method: 'POST',
        body: { user_prompt: prompt },
        keepUnusedDataFor: 0,
      }),
    }),
  }),
});

// temp workaroud weird chat response
// function transformSimplePromptResponse(
//   response: ManualPromptResponseData[]
// ): ChatHistory {
//   const endpointsCurrentchatsMap = response[0].current_chats;
//   const constructedChathistory: ChatHistory = {};
//   Object.keys(endpointsCurrentchatsMap).forEach((endpointId) => {
//     constructedChathistory[endpointId] = [
//       {
//         chat_record_id: 0,
//         conn_id: endpointId,
//         context_strategy: '',
//         prompt_template: '',
//         attack_module: '',
//         metric: '',
//         prompt: endpointsCurrentchatsMap[endpointId][0].prompt,
//         prepared_prompt: endpointsCurrentchatsMap[endpointId][0].prompt,
//         system_prompt: '',
//         predicted_result: endpointsCurrentchatsMap[endpointId][0].response,
//         duration: '0',
//         prompt_time: endpointsCurrentchatsMap[endpointId][0].prompt_time,
//       },
//     ];
//   });
//   return constructedChathistory;
// }

const {
  useGetAllSessionsQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useSetPromptTemplateMutation,
  useUnsetPromptTemplateMutation,
  useSendPromptMutation,
  useSendArtPromptMutation,
  useCreateSessionMutation,
  useSetAttackModuleMutation,
  useUnsetAttackModuleMutation,
  useSetContextStrategyMutation,
  useUnsetContextStrategyMutation,
  useCloseSessionMutation,
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
  useSendArtPromptMutation,
  useSetAttackModuleMutation,
  useUnsetAttackModuleMutation,
  useSetContextStrategyMutation,
  useUnsetContextStrategyMutation,
  useCloseSessionMutation,
};
