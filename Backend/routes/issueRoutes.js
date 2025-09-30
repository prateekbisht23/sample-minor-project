const express = require('express');
const { body, param, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const issueController = require('../controllers/issueController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'), false);
  }
};

// File filter for audio
const audioFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

// Multer instances
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

const uploadAudio = multer({
  storage: storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

/**
 * Validation rules for issue submission
 */
const issueValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
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
 * Validation rules for AI issue submission
 */
const aiIssueValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
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
 * Validation rules for issue ID parameter
 */
const issueIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid issue ID')
];

// File upload routes
/**
 * @route   POST /api/issues/upload/photo
 * @desc    Upload photo file
 * @access  Private
 */
router.post('/upload/photo', 
  authenticateToken,
  uploadImage.single('photo'),
  issueController.uploadPhoto
);

/**
 * @route   POST /api/issues/upload/voice
 * @desc    Upload voice file
 * @access  Private
 */
router.post('/upload/voice',
  authenticateToken,
  uploadAudio.single('voice'),
  issueController.uploadVoice
);

// AI processing routes
/**
 * @route   POST /api/issues/classify-image
 * @desc    Classify image with AI
 * @access  Private
 */
router.post('/classify-image',
  authenticateToken,
  uploadImage.single('image'),
  issueController.classifyImage
);

/**
 * @route   POST /api/issues/transcribe-voice
 * @desc    Transcribe voice with AI
 * @access  Private
 */
router.post('/transcribe-voice',
  authenticateToken,
  uploadAudio.single('voice'),
  issueController.transcribeVoice
);

// Issue submission routes
/**
 * @route   POST /api/issues
 * @desc    Submit a new issue
 * @access  Private
 */
router.post('/',
  authenticateToken,
  issueValidation,
  issueController.submitIssue
);

/**
 * @route   POST /api/issues/ai-image
 * @desc    Submit issue with AI image analysis
 * @access  Private
 */
router.post('/ai-image',
  authenticateToken,
  uploadImage.single('image'),
  aiIssueValidation,
  issueController.submitIssueWithAIImage
);

/**
 * @route   POST /api/issues/ai-voice
 * @desc    Submit issue with AI voice analysis
 * @access  Private
 */
router.post('/ai-voice',
  authenticateToken,
  uploadAudio.single('voice'),
  aiIssueValidation,
  issueController.submitIssueWithAIVoice
);

// Issue retrieval routes
/**
 * @route   GET /api/issues/user
 * @desc    Get user's issues
 * @access  Private
 */
router.get('/user',
  authenticateToken,
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
      .optional(),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'title', 'status', 'category'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  issueController.getUserIssues
);

/**
 * @route   GET /api/issues/public
 * @desc    Get public issues
 * @access  Public
 */
router.get('/public',
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
      .optional(),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'title', 'status', 'category'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  issueController.getPublicIssues
);

/**
 * @route   GET /api/issues/:id
 * @desc    Get issue by ID
 * @access  Private
 */
router.get('/:id',
  authenticateToken,
  issueIdValidation,
  issueController.getIssueById
);

// Issue update routes
/**
 * @route   PUT /api/issues/:id
 * @desc    Update issue
 * @access  Private
 */
router.put('/:id',
  authenticateToken,
  issueIdValidation,
  updateIssueValidation,
  issueController.updateIssue
);

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete issue
 * @access  Private
 */
router.delete('/:id',
  authenticateToken,
  issueIdValidation,
  issueController.deleteIssue
);

module.exports = router;
