import apiClient from '../api/axiosConfig';
import { API_ENDPOINTS, APP_CONFIG } from '../config/constants';

class IssueService {
  /**
   * Upload photo file
   * @param {string} fileUri - Local file URI
   * @returns {Promise<Object>} - Upload response
   */
  async uploadPhoto(fileUri) {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload voice file
   * @param {string} fileUri - Local file URI
   * @returns {Promise<Object>} - Upload response
   */
  async uploadVoice(fileUri) {
    try {
      const formData = new FormData();
      formData.append('voice', {
        uri: fileUri,
        type: 'audio/mpeg',
        name: 'voice.mp3',
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.UPLOAD_VOICE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Classify image with AI
   * @param {string} fileUri - Local file URI
   * @returns {Promise<Object>} - AI classification response
   */
  async classifyImage(fileUri) {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.CLASSIFY_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Transcribe voice with AI
   * @param {string} fileUri - Local file URI
   * @returns {Promise<Object>} - AI transcription response
   */
  async transcribeVoice(fileUri) {
    try {
      const formData = new FormData();
      formData.append('voice', {
        uri: fileUri,
        type: 'audio/mpeg',
        name: 'voice.mp3',
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.TRANSCRIBE_VOICE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit a new issue
   * @param {Object} issueData - Issue data
   * @returns {Promise<Object>} - Issue submission response
   */
  async submitIssue(issueData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ISSUES.BASE, issueData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit issue with AI image analysis
   * @param {Object} issueData - Issue data with image
   * @returns {Promise<Object>} - Issue submission response
   */
  async submitIssueWithAIImage(issueData) {
    try {
      const formData = new FormData();
      
      // Add image file
      if (issueData.imageUri) {
        formData.append('image', {
          uri: issueData.imageUri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }

      // Add other form data
      Object.keys(issueData).forEach(key => {
        if (key !== 'imageUri' && issueData[key] !== undefined) {
          formData.append(key, issueData[key]);
        }
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.AI_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit issue with AI voice analysis
   * @param {Object} issueData - Issue data with voice
   * @returns {Promise<Object>} - Issue submission response
   */
  async submitIssueWithAIVoice(issueData) {
    try {
      const formData = new FormData();
      
      // Add voice file
      if (issueData.voiceUri) {
        formData.append('voice', {
          uri: issueData.voiceUri,
          type: 'audio/mpeg',
          name: 'voice.mp3',
        });
      }

      // Add other form data
      Object.keys(issueData).forEach(key => {
        if (key !== 'voiceUri' && issueData[key] !== undefined) {
          formData.append(key, issueData[key]);
        }
      });

      const response = await apiClient.post(API_ENDPOINTS.ISSUES.AI_VOICE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's issues
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - User issues response
   */
  async getUserIssues(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ISSUES.USER, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get issue by ID
   * @param {string} issueId - Issue ID
   * @returns {Promise<Object>} - Issue details
   */
  async getIssueById(issueId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ISSUES.BASE}/${issueId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update issue
   * @param {string} issueId - Issue ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} - Updated issue
   */
  async updateIssue(issueId, updateData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ISSUES.BASE}/${issueId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete issue
   * @param {string} issueId - Issue ID
   * @returns {Promise<Object>} - Delete response
   */
  async deleteIssue(issueId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.ISSUES.BASE}/${issueId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get nearby issues from backend API
   * @param {Object} location - Location coordinates
   * @returns {Promise<Array>} - Nearby issues
   */
  async getNearbyIssues(location) {
    try {
      const params = {};
      if (location?.latitude && location?.longitude) {
        params.latitude = location.latitude;
        params.longitude = location.longitude;
        params.radius = 5; // 5km radius
      }
      
      const response = await apiClient.get(API_ENDPOINTS.ISSUES.NEARBY, { params });
      return response.data?.issues || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get public issues from backend API
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Public issues response
   */
  async getPublicIssues(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ISSUES.PUBLIC, { params });
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

export default new IssueService();
