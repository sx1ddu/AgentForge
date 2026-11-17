import api from "../../utils/axios.js";

const sendMessage = async (payload) => {
  try {
    const isFormData = payload instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};

    const { data } = await api.post("/api/agent/chat", payload, {
      headers,
      timeout: 180000, // 3 minutes timeout for complex multi-agent runs
    });
    return data;
  } catch (error) {
    console.error("sendMessage error:", error);
    throw error;
  }
};

export default sendMessage;
