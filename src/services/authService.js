import apiInstance from "../libs/axios";

export const loginUser = async (credentials) => {
  const response = await apiInstance.post(`/auth/login`, credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await apiInstance.post(`/auth/signup`, userData);
  return response.data;
};