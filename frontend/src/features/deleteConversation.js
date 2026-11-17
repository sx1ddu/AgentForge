import api from "../../utils/axios";

export const deleteConversation = async (conversationId) => {
  try {
    const { data } = await api.delete(`/api/chat/delete-conversation/${conversationId}`);
    return data;
  } catch (error) {
    console.warn("DELETE delete-conversation failed, trying POST fallback:", error.message);
    try {
      const { data } = await api.post("/api/chat/delete-conversation", { id: conversationId });
      return data;
    } catch (fallbackError) {
      console.error("Failed to delete conversation:", fallbackError);
      return null;
    }
  }
};
