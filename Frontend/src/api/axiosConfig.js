import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear stored token and user data
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        
        // You can dispatch a logout action here if using Redux
        // or trigger a context update
        console.log('User session expired. Please login again.');
        
        // Optionally redirect to login screen
        // This would require navigation context
      } catch (clearError) {
        console.error('Error clearing stored data:', clearError);
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
