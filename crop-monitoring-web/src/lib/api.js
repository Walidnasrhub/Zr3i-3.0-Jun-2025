import axios from 'axios';

// API base URL - change this to your actual API URL when deploying
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Fields API
export const fieldsAPI = {
  getFields: () => api.get('/fields'),
  getField: (id) => api.get(`/fields/${id}`),
  createField: (fieldData) => api.post('/fields', fieldData),
  updateField: (id, fieldData) => api.put(`/fields/${id}`, fieldData),
  deleteField: (id) => api.delete(`/fields/${id}`),
};

// Satellite API
export const satelliteAPI = {
  getImages: (fieldId) => api.get(`/satellite/fields/${fieldId}/satellite-images`),
  getImage: (fieldId, imageId) => api.get(`/satellite/fields/${fieldId}/satellite-images/${imageId}`),
  fetchData: (fieldId, params) => api.post(`/satellite/fields/${fieldId}/fetch-satellite-data`, params),
  getVegetationIndices: (fieldId, params) => api.get(`/satellite/fields/${fieldId}/vegetation-indices`, { params }),
};

export default api;

