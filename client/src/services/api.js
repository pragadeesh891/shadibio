
import axios from "axios";

// Auto detect API URL (local + production)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://shadibio.onrender.com/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

// Biodata API
export const biodataService = {
  createBiodata: async (biodataData) => {
    const response = await api.post("/biodata", biodataData);
    return response.data;
  },

  getUserBiodata: async () => {
    const response = await api.get("/biodata/user/me");
    return response.data;
  },

  updateBiodata: async (id, biodataData) => {
    const response = await api.put(`/biodata/${id}`, biodataData);
    return response.data;
  },

  deleteBiodata: async (id) => {
    const response = await api.delete(`/biodata/${id}`);
    return response.data;
  },
};

// Chatbot API
export const chatbotService = {
  sendMessage: async (message) => {
    const response = await api.post("/chatbot", { message });
    return response.data;
  },
};

export default api;
```
