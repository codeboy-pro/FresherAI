import api from "../utils/axios";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/me");
   
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Unable to load current user:", error);
    }
    return null;
  }
};
