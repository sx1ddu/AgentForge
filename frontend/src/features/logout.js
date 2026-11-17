import api from "../../utils/axios";

export const logOut = async () => {
  try {
    const { data } = await api.post("/api/auth/logout");
    return data;
  } catch (error) {
    console.error("Logout request error:", error);
    try {
      // Fallback GET attempt
      const { data } = await api.get("/api/auth/logout");
      return data;
    } catch {
      return null;
    }
  }
};

export default logOut;
