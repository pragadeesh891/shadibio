import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Biodata API
export const biodataService = {
  // Create biodata
  createBiodata: async (biodataData) => {
    const response = await api.post('/biodata', biodataData);
    return response.data;
  },

  // Get user's biodata
  getUserBiodata: async () => {
    const response = await api.get('/biodata/user/me');
    return response.data;
  },

  // Update biodata
  updateBiodata: async (id, biodataData) => {
    const response = await api.put(`/biodata/${id}`, biodataData);
    return response.data;
  },

  // Delete biodata
  deleteBiodata: async (id) => {
    const response = await api.delete(`/biodata/${id}`);
    return response.data;
  }
};

// Chatbot API
export const chatbotService = {
  sendMessage: async (message) => {
    const response = await api.post('/chatbot', { message });
    return response.data;
  }
};

export default api;