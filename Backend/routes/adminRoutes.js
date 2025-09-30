const express = require('express');
const { body, param, query } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(isAdmin);

/**
 * Validation rules for issue status update
 */
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    .withMessage('Invalid status. Must be one of: PENDING, VERIFIED, IN_PROGRESS, RESOLVED, REJECTED')
];

/**
 * Validation rules for issue update
 */
const updateIssueValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional(),
  body('status')
    .optional()
    .isIn(['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    .withMessage('Invalid status'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

/**
 * Validation rules for user role update
 */
const updateRoleValidation = [
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

/**
 * Validation rules for issue ID parameter
 */
const issueIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid issue ID')
];

/**
 * Validation rules for user ID parameter
 */
const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
];

// Dashboard routes
/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', adminController.getDashboardStats);

// Issue management routes
/**
 * @route   GET /api/admin/issues
 * @desc    Get all issues with pagination and filtering
 * @access  Private (Admin only)
 */
router.get('/issues',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
      .withMessage('Invalid status'),
    query('category')
      .optional()
      .isIn(['Pothole', 'Trash', 'Street Light', 'Traffic Signal', 'Other'])
      .withMessage('Invalid category'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'title', 'status', 'category'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  adminController.getIssues
);

/**
 * @route   GET /api/admin/issues/:id
 * @desc    Get issue by ID
 * @access  Private (Admin only)
 */
router.get('/issues/:id',
  issueIdValidation,
  adminController.getIssueById
);

/**
 * @route   PUT /api/admin/issues/:id
 * @desc    Update issue details
 * @access  Private (Admin only)
 */
router.put('/issues/:id',
  issueIdValidation,
  updateIssueValidation,
  adminController.updateIssue
);

/**
 * @route   PATCH /api/admin/issues/:id/status
 * @desc    Update issue status
 * @access  Private (Admin only)
 */
router.patch('/issues/:id/status',
  issueIdValidation,
  updateStatusValidation,
  adminController.updateIssueStatus
);

/**
 * @route   DELETE /api/admin/issues/:id
 * @desc    Delete issue
 * @access  Private (Admin only)
 */
router.delete('/issues/:id',
  issueIdValidation,
  adminController.deleteIssue
);

// User management routes
/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin only)
 */
router.get('/users',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Invalid role'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'email', 'role'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  adminController.getUsers
);

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
router.patch('/users/:id/role',
  userIdValidation,
  updateRoleValidation,
  adminController.updateUserRole
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/users/:id',
  userIdValidation,
  adminController.deleteUser
);

module.exports = router;
