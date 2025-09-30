const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, role } = req.body;

      // Register user
      const result = await authService.register({
        email,
        password,
        role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Login user
      const result = await authService.login({
        email,
        password
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated through this endpoint
      delete updateData.password;
      delete updateData.role;

      const user = await authService.updateUser(userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Change user password
   * PUT /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController();
