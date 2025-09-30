const { Issue } = require('../models/dbModels');
const aiService = require('./aiService');

/**
 * Issue Service
 * Handles business logic for issue management
 */
class IssueService {
  /**
   * Create a new issue
   * @param {Object} issueData - Issue data
   * @returns {Promise<Object>} - Created issue
   */
  async createIssue(issueData) {
    try {
      const issue = new Issue(issueData);
      const savedIssue = await issue.save();
      
      // Populate reporter information
      await savedIssue.populate('reporterId', 'email role');
      
      return savedIssue;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get issues by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - User's issues
   */
  async getUserIssues(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Build query
      const query = { reporterId: userId };
      
      if (status) {
        query.status = status;
      }
      
      if (category) {
        query.category = category;
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      const issues = await Issue.find(query)
        .populate('reporterId', 'email role')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Issue.countDocuments(query);

      return {
        issues,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all issues (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - All issues
   */
  async getAllIssues(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Build query
      const query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (category) {
        query.category = category;
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      const issues = await Issue.find(query)
        .populate('reporterId', 'email role')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Issue.countDocuments(query);

      return {
        issues,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get issue by ID
   * @param {string} issueId - Issue ID
   * @returns {Promise<Object>} - Issue details
   */
  async getIssueById(issueId) {
    try {
      const issue = await Issue.findById(issueId)
        .populate('reporterId', 'email role');
      
      if (!issue) {
        throw new Error('Issue not found');
      }

      return issue;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update issue status
   * @param {string} issueId - Issue ID
   * @param {string} status - New status
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} - Updated issue
   */
  async updateIssueStatus(issueId, status, adminId) {
    try {
      const validStatuses = ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
      
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
      }

      const issue = await Issue.findByIdAndUpdate(
        issueId,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).populate('reporterId', 'email role');

      if (!issue) {
        throw new Error('Issue not found');
      }

      return issue;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update issue details
   * @param {string} issueId - Issue ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated issue
   */
  async updateIssue(issueId, updateData) {
    try {
      // Remove fields that shouldn't be updated
      delete updateData.reporterId;
      delete updateData.createdAt;

      const issue = await Issue.findByIdAndUpdate(
        issueId,
        updateData,
        { new: true, runValidators: true }
      ).populate('reporterId', 'email role');

      if (!issue) {
        throw new Error('Issue not found');
      }

      return issue;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete issue
   * @param {string} issueId - Issue ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} - Success message
   */
  async deleteIssue(issueId, userId) {
    try {
      const issue = await Issue.findById(issueId);
      
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Check if user owns the issue or is admin
      if (issue.reporterId.toString() !== userId) {
        throw new Error('Unauthorized to delete this issue');
      }

      await Issue.findByIdAndDelete(issueId);

      return { message: 'Issue deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get issue statistics
   * @returns {Promise<Object>} - Issue statistics
   */
  async getIssueStatistics() {
    try {
      const stats = await Issue.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const categoryStats = await Issue.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalIssues = await Issue.countDocuments();
      const recentIssues = await Issue.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      });

      return {
        totalIssues,
        recentIssues,
        statusBreakdown: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        categoryBreakdown: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process image with AI and create issue
   * @param {Object} file - Uploaded image file
   * @param {Object} issueData - Basic issue data
   * @returns {Promise<Object>} - Created issue with AI analysis
   */
  async processImageAndCreateIssue(file, issueData) {
    try {
      // Get AI classification
      const aiResult = await aiService.classifyImage(file);
      
      if (!aiResult.success) {
        throw new Error('AI processing failed: ' + aiResult.error);
      }

      // Check if it's a civic issue
      if (!aiResult.data.isCivicIssue) {
        throw new Error('This does not appear to be a civic infrastructure issue. Please ensure you are reporting actual infrastructure problems.');
      }

      // Use AI-enhanced title and description if provided, otherwise use user input
      const enhancedIssueData = {
        ...issueData,
        title: aiResult.data.enhancedTitle || issueData.title,
        description: aiResult.data.enhancedDescription || issueData.description,
        category: aiResult.data.category,
        priority: aiResult.data.priority,
        // Add AI analysis to description
        description: (aiResult.data.enhancedDescription || issueData.description) + 
          `\n\nAI Analysis: ${aiResult.data.description}\nConfidence: ${Math.round(aiResult.data.confidence * 100)}%`
      };

      // Create issue
      const issue = await this.createIssue(enhancedIssueData);

      return {
        issue,
        aiAnalysis: aiResult.data
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process voice with AI and create issue
   * @param {Object} file - Uploaded audio file
   * @param {Object} issueData - Basic issue data
   * @returns {Promise<Object>} - Created issue with AI analysis
   */
  async processVoiceAndCreateIssue(file, issueData) {
    try {
      // Get AI transcription and classification
      const aiResult = await aiService.transcribeAndClassifyVoice(file);
      
      if (!aiResult.success) {
        throw new Error('AI processing failed: ' + aiResult.error);
      }

      // Update issue data with AI results
      const enhancedIssueData = {
        ...issueData,
        title: issueData.title || `Voice Report: ${aiResult.data.category}`,
        description: issueData.description + 
          `\n\nVoice Transcription: ${aiResult.data.transcription}\n\nAI Analysis: ${aiResult.data.description}\nConfidence: ${Math.round(aiResult.data.confidence * 100)}%`,
        category: aiResult.data.category
      };

      // Create issue
      const issue = await this.createIssue(enhancedIssueData);

      return {
        issue,
        aiAnalysis: aiResult.data
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new IssueService();
