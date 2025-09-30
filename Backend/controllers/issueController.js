const { validationResult } = require('express-validator');
const issueService = require('../services/issueService');
const aiService = require('../services/aiService');

/**
 * Issue Controller
 * Handles issue-related HTTP requests
 */
class IssueController {
  /**
   * Submit a new issue
   * POST /api/issues
   */
  async submitIssue(req, res) {
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

      const { title, description, category, latitude, longitude } = req.body;
      const reporterId = req.user.id;

      const issueData = {
        reporterId,
        title,
        description,
        category,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        mediaUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      };

      const issue = await issueService.createIssue(issueData);

      res.status(201).json({
        success: true,
        message: 'Issue submitted successfully',
        data: { issue }
      });
    } catch (error) {
      console.error('Submit issue error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit issue',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Process image with AI and submit issue
   * POST /api/issues/ai-image
   */
  async submitIssueWithAIImage(req, res) {
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required'
        });
      }

      const { title, description, priority, latitude, longitude } = req.body;
      const reporterId = req.user.id;

      const issueData = {
        reporterId,
        title: title || 'AI-Detected Issue',
        description: description || 'Issue detected using AI image analysis',
        priority: priority || 'medium',
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        mediaUrl: `/uploads/${req.file.filename}`
      };

      const result = await issueService.processImageAndCreateIssue(req.file, issueData);

      res.status(201).json({
        success: true,
        message: 'Issue submitted successfully with AI analysis',
        data: result
      });
    } catch (error) {
      console.error('Submit AI image issue error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit issue with AI analysis',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Process voice with AI and submit issue
   * POST /api/issues/ai-voice
   */
  async submitIssueWithAIVoice(req, res) {
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const { title, description, latitude, longitude } = req.body;
      const reporterId = req.user.id;

      const issueData = {
        reporterId,
        title: title || 'Voice Report',
        description: description || 'Issue reported via voice',
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        mediaUrl: `/uploads/${req.file.filename}`
      };

      const result = await issueService.processVoiceAndCreateIssue(req.file, issueData);

      res.status(201).json({
        success: true,
        message: 'Issue submitted successfully with AI voice analysis',
        data: result
      });
    } catch (error) {
      console.error('Submit AI voice issue error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit issue with AI voice analysis',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get user's issues
   * GET /api/issues/user
   */
  async getUserIssues(req, res) {
    try {
      const userId = req.user.id;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        status: req.query.status,
        category: req.query.category,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await issueService.getUserIssues(userId, options);

      res.status(200).json({
        success: true,
        message: 'Issues retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get user issues error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve issues',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get public issues
   * GET /api/issues/public
   */
  async getPublicIssues(req, res) {
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
        message: 'Public issues retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Get public issues error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve public issues',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get issue by ID
   * GET /api/issues/:id
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
   * Update issue
   * PUT /api/issues/:id
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
      const userId = req.user.id;

      // Check if user owns the issue
      const issue = await issueService.getIssueById(id);
      if (issue.reporterId._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this issue'
        });
      }

      const updatedIssue = await issueService.updateIssue(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Issue updated successfully',
        data: { issue: updatedIssue }
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
   * Delete issue
   * DELETE /api/issues/:id
   */
  async deleteIssue(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await issueService.deleteIssue(id, userId);

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

      if (error.message === 'Unauthorized to delete this issue') {
        return res.status(403).json({
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
   * Upload photo
   * POST /api/issues/upload/photo
   */
  async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No photo file uploaded'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload photo',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Upload voice
   * POST /api/issues/upload/voice
   */
  async uploadVoice(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No voice file uploaded'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Voice file uploaded successfully',
        data: {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload voice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload voice file',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Classify image with AI
   * POST /api/issues/classify-image
   */
  async classifyImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded'
        });
      }

      const result = await aiService.classifyImage(req.file);

      res.status(200).json({
        success: true,
        message: 'Image classified successfully',
        data: result
      });
    } catch (error) {
      console.error('Classify image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to classify image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Transcribe voice with AI
   * POST /api/issues/transcribe-voice
   */
  async transcribeVoice(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No voice file uploaded'
        });
      }

      const result = await aiService.transcribeAndClassifyVoice(req.file);

      res.status(200).json({
        success: true,
        message: 'Voice transcribed successfully',
        data: result
      });
    } catch (error) {
      console.error('Transcribe voice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to transcribe voice',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new IssueController();
