import apiClient from '../api/axiosConfig';
import { API_ENDPOINTS } from '../config/constants';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} - Login response
   */
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile
   */
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} - Updated profile
   */
  async updateProfile(updateData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} - Password change response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - API error
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      
      return new Error(`${message} (${status})`);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new AuthService();
