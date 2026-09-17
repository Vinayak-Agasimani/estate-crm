import api from "./api";

export const submitPropertyEnquiry = async (data) => {
  const response = await api.post("/public/enquiries", data);

  return response.data;
};