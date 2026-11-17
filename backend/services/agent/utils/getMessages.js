import axios from "axios";

export const getMessages = async (conversationId) => {
  try {
    const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:8002";
    const { data } = await axios.get(
      `${chatServiceUrl}/get-messages/${conversationId}`,
      {
        headers: {
          "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
        },
        timeout: 10000,
      }
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Agent getMessages error:", error.message);
    return [];
  }
};
