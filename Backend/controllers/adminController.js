const { validationResult } = require('express-validator');
const issueService = require('../services/issueService');
const authService = require('../services/authService');
const { User } = require('../models/dbModels');

/**
 * Admin Controller
 * Handles admin-related HTTP requests
 */
class AdminController {
  /**
   * Get all issues with pagination and filtering
   * GET /api/admin/issues
   */
  async getIssues(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        status: req.query.status,
        category: req.query.category,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await issueService.getAllIssues(options);

      res.status(200).json({
        success: true,
        message: 'Issues retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get all issues error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve issues',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update issue status
   * PATCH /api/admin/issues/:id/status
   */
  async updateIssueStatus(req, res) {
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

      const { id } = req.params;
      const { status } = req.body;
      const adminId = req.user.id;

      const issue = await issueService.updateIssueStatus(id, status, adminId);

      res.status(200).json({
        success: true,
        message: 'Issue status updated successfully',
        data: { issue }
      });
    } catch (error) {
      console.error('Update issue status error:', error);
      
      if (error.message === 'Issue not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Invalid status')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update issue status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get issue by ID (admin view)
   * GET /api/admin/issues/:id
   */
  async getIssueById(req, res) {
    try {
      const { id } = req.params;
      const issue = await issueService.getIssueById(id);

      res.status(200).json({
        success: true,
        message: 'Issue retrieved successfully',
        data: { issue }
      });
    } catch (error) {
      console.error('Get issue by ID error:', error);
      
      if (error.message === 'Issue not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve issue',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update issue details (admin)
   * PUT /api/admin/issues/:id
   */
  async updateIssue(req, res) {
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

      const { id } = req.params;
      const updateData = req.body;

      const issue = await issueService.updateIssue(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Issue updated successfully',
        data: { issue }
      });
    } catch (error) {
      console.error('Update issue error:', error);
      
      if (error.message === 'Issue not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update issue',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete issue (admin)
   * DELETE /api/admin/issues/:id
   */
  async deleteIssue(req, res) {
    try {
      const { id } = req.params;

      // For admin, we can delete any issue
      const issue = await issueService.getIssueById(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
      }

      await issueService.deleteIssue(id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Issue deleted successfully'
      });
    } catch (error) {
      console.error('Delete issue error:', error);
      
      if (error.message === 'Issue not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete issue',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get dashboard statistics
   * GET /api/admin/dashboard
   */
  async getDashboardStats(req, res) {
    try {
      const stats = await issueService.getIssueStatistics();

      // Get additional user statistics
      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ role: 'admin' });
      const regularUsers = await User.countDocuments({ role: 'user' });

      res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: {
          ...stats,
          users: {
            total: totalUsers,
            admins: adminUsers,
            regular: regularUsers
          }
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all users
   * GET /api/admin/users
   */
  async getUsers(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        role: req.query.role,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      // Build query
      const query = {};
      if (options.role) {
        query.role = options.role;
      }

      // Build sort object
      const sort = {};
      sort[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (options.page - 1) * options.limit;

      const users = await User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(options.limit));

      const total = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            currentPage: options.page,
            totalPages: Math.ceil(total / options.limit),
            totalItems: total,
            itemsPerPage: options.limit
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update user role
   * PATCH /api/admin/users/:id/role
   */
  async updateUserRole(req, res) {
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

      const { id } = req.params;
      const { role } = req.body;

      // Prevent admin from changing their own role
      if (id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own role'
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update user role error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update user role',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete user
   * DELETE /api/admin/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new AdminController();
