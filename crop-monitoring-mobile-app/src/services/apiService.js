import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base URL for the API - update this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('authToken');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  validateToken: async (token) => {
    try {
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  },
};

export const fieldService = {
  getFields: async () => {
    try {
      const response = await api.get('/fields');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch fields',
      };
    }
  },

  createField: async (fieldData) => {
    try {
      const response = await api.post('/fields', fieldData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create field',
      };
    }
  },

  updateField: async (fieldId, fieldData) => {
    try {
      const response = await api.put(`/fields/${fieldId}`, fieldData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update field',
      };
    }
  },

  deleteField: async (fieldId) => {
    try {
      await api.delete(`/fields/${fieldId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete field',
      };
    }
  },
};

export const satelliteService = {
  getSatelliteData: async (fieldId, startDate, endDate) => {
    try {
      const response = await api.get(`/satellite/data/${fieldId}`, {
        params: { start_date: startDate, end_date: endDate },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch satellite data',
      };
    }
  },

  getVegetationIndices: async (fieldId) => {
    try {
      const response = await api.get(`/satellite/vegetation-indices/${fieldId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch vegetation indices',
      };
    }
  },
};

export const weatherService = {
  getCurrentWeather: async (lat, lon) => {
    try {
      const response = await api.get('/weather/current', {
        params: { lat, lon },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch weather data',
      };
    }
  },

  getForecast: async (lat, lon, days = 7) => {
    try {
      const response = await api.get('/weather/forecast', {
        params: { lat, lon, days },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch weather forecast',
      };
    }
  },
};

export const farmToForkService = {
  getProducts: async () => {
    try {
      const response = await api.get('/farm-to-fork/products');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  },

  addTraceabilityRecord: async (productId, recordData) => {
    try {
      const response = await api.post(`/farm-to-fork/products/${productId}/records`, recordData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add traceability record',
      };
    }
  },

  uploadImage: async (imageUri, productId, recordData) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'traceability_image.jpg',
      });
      formData.append('data', JSON.stringify(recordData));

      const response = await api.post(`/farm-to-fork/products/${productId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload image',
      };
    }
  },
};

export default api;

