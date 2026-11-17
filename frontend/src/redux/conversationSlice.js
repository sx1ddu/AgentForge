import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = Array.isArray(action.payload) ? action.payload : [];
    },
    addConversations: (state, action) => {
      if (action.payload && action.payload._id) {
        state.conversations.unshift(action.payload);
      }
    },
    removeConversation: (state, action) => {
      const idToRemove = action.payload;
      state.conversations = state.conversations.filter((c) => c._id !== idToRemove);
      if (state.selectedConversation?._id === idToRemove) {
        state.selectedConversation = state.conversations[0] || null;
      }
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, title } : conv
      );

      if (state.selectedConversation?._id === conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title };
      }
    },
  },
});

export const {
  setConversations,
  addConversations,
  removeConversation,
  setSelectedConversation,
  setConvTitle,
} = conversationSlice.actions;

export default conversationSlice.reducer;
