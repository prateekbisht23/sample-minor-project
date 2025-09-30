const jwt = require('jsonwebtoken');
const { User } = require('../models/dbModels');

/**
 * Authentication service
 * Handles user authentication logic
 */
class AuthService {
  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user and token
   */
  async register(userData) {
    try {
      const { email, password, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        role
      });

      // Save user to database
      const savedUser = await user.save();

      // Generate token
      const token = this.generateToken(savedUser);

      return {
        user: savedUser.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} - User and token
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User object
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Success message
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
