import api from "../../utils/axios";

export const createConversation = async (title = "New Chat") => {
  try {
    const { data } = await api.post("/api/chat/create-conversation", { title });
    return data;
  } catch (error) {
    console.warn("POST create-conversation failed, trying GET fallback:", error.message);
    try {
      const { data } = await api.get("/api/chat/create-conversation");
      return data;
    } catch (fallbackError) {
      console.error("Failed to create conversation:", fallbackError);
      return null;
    }
  }
};
