import api from "../../utils/axios";

export const updateConversation = async (idOrPayload, maybeTitle) => {
  try {
    let payload;
    if (typeof idOrPayload === "string") {
      payload = { id: idOrPayload, title: maybeTitle };
    } else if (idOrPayload && typeof idOrPayload === "object") {
      payload = {
        id: idOrPayload.id || idOrPayload.conversationId,
        title: idOrPayload.title || maybeTitle,
      };
    } else {
      payload = {};
    }
    const { data } = await api.post("/api/chat/update-conversation", payload);
    return data;
  } catch (error) {
    console.error("Update conversation error:", error);
    return null;
  }
};
