import api from "./api";

export const createLead = async (leadData) => {
  const response = await api.post("/leads", leadData);
  return response.data;
};