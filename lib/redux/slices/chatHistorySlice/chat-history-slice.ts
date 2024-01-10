import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatHistoryState = {
  entity: Record<string, DialoguePairInfo[]>;
};

type UpdatePayload = {
  chatId: string;
  dialoguePairInfos: DialoguePairInfo[];
};

const initialState: ChatHistoryState = {
  entity: {},
};

export const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState,
  reducers: {
    updateChatHistory: (state, action: PayloadAction<UpdatePayload>) => {
      const { chatId, dialoguePairInfos } = action.payload;
      if (state.entity) {
        state.entity[chatId] = dialoguePairInfos;
      }
    },
  },
});

export const { updateChatHistory } = chatHistorySlice.actions;

export default chatHistorySlice.reducer;
