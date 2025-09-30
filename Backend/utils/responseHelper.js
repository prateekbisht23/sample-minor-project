/**
 * Response helper utilities
 * Provides standardized response formats for the API
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {Object} meta - Additional metadata (pagination, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta })
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Validation errors or additional error details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 * @param {string} message - Error message
 */
const sendValidationError = (res, errors, message = 'Validation failed') => {
  return sendError(res, 400, message, errors);
};

/**
 * Send not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

/**
 * Send unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, 401, message);
};

/**
 * Send forbidden error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, 403, message);
};

/**
 * Send conflict error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendConflict = (res, message = 'Conflict') => {
  return sendError(res, 409, message);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Created resource data
 */
const sendCreated = (res, message = 'Resource created successfully', data = null) => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Send no content response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 */
const sendNoContent = (res, message = 'No content') => {
  return res.status(204).json({
    success: true,
    message
  });
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
const sendPaginated = (res, data, pagination, message = 'Data retrieved successfully') => {
  return sendSuccess(res, 200, message, data, { pagination });
};

/**
 * Format pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} - Formatted pagination object
 */
const formatPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Format error response for development
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 */
const sendDevError = (error, res, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    error: {
      name: error.name,
      stack: error.stack,
      ...(error.errors && { errors: error.errors })
    }
  });
};

/**
 * Format error response for production
 * @param {string} message - Error message
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 */
const sendProdError = (message, res, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendConflict,
  sendCreated,
  sendNoContent,
  sendPaginated,
  formatPagination,
  sendDevError,
  sendProdError
};
