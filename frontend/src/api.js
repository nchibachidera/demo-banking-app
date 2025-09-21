import axios from "axios";

// Create a base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if backend changes
});

// Add token automatically if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

