import axios from "axios";

const url = process.env.NODE_ENV == 'development' ? "http://localhost:8080/api" : 'https://task-managment-api-psi.vercel.app/api'
const apiInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(message);
  }
);

export default apiInstance;