import api from "../utils/axios";

export const startInterview = async (data) => {
  try {
    const response = await api.post("/api/interview/start", data);
    return response?.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const getInterview = async (id) => {
  try {
    const response = await api.get(`/api/interview/${id}`);
    console.log("response", response.data);

    return response?.data;
  } catch (error) {
    console.log("error", error);

    return null;
  }
};

export const submitAnswer = async (data) => {
  try {
    const response = await api.post(`/api/interview/answer`, data);
    console.log("response", response.data);

    return response?.data;
  } catch (error) {
    console.error("Answer submission failed:", error.response?.data || error);

    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
