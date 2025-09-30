const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import services and utilities
const dbService = require('./services/dbService');
const { globalErrorHandler } = require('./utils/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import AI service for status check
const aiService = require('./services/aiService');

/**
 * CivicSight-AI Backend Server
 * A complete backend API for civic issue reporting and management
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with actual frontend domain
    : [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'http://192.168.0.118:3000',  // Your phone's network IP
        'http://192.168.0.118:8081',  // Expo dev server
        'http://192.168.0.118:19000', // Expo web
        'http://192.168.0.118:19001', // Expo web
        'http://192.168.0.118:19002', // Expo web
        'exp://192.168.0.118:8081',   // Expo protocol
        'exp://192.168.0.118:19000',  // Expo protocol
        'exp://192.168.0.118:19001',  // Expo protocol
        'exp://192.168.0.118:19002'   // Expo protocol
      ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CivicSight-AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbService.getConnectionStatus() ? 'connected' : 'disconnected',
    aiService: aiService.getServiceStatus()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is operational',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      issues: '/api/issues',
      admin: '/api/admin'
    },
    features: [
      'User authentication',
      'Issue reporting',
      'AI-powered classification',
      'File uploads',
      'Admin management',
      'Real-time status updates'
    ]
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CivicSight-AI API',
    version: '1.0.0',
    documentation: {
      health: '/health',
      status: '/api/status',
      auth: '/api/auth',
      issues: '/api/issues',
      admin: '/api/admin'
    },
    quickStart: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      submitIssue: 'POST /api/issues',
      getIssues: 'GET /api/issues/user'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/status',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'POST /api/issues',
      'GET /api/issues/user',
      'GET /api/admin/issues'
    ]
  });
});

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to database
    console.log('🔄 Connecting to database...');
    await dbService.connect();
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    // Test AI service
    console.log('🤖 Testing AI service...');
    const aiStatus = aiService.getServiceStatus();
    console.log('AI Service Status:', aiStatus.status);

    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 CivicSight-AI Backend Server Started!');
      console.log('=====================================');
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 Local URL: http://localhost:${PORT}`);
      console.log(`📱 Phone Network URL: http://192.168.0.118:${PORT}`);
      console.log(`📊 Health Check: http://192.168.0.118:${PORT}/health`);
      console.log(`📋 API Status: http://192.168.0.118:${PORT}/api/status`);
      console.log('=====================================');
      console.log('\n📚 Available Endpoints:');
      console.log('  Authentication:');
      console.log('    POST /api/auth/register');
      console.log('    POST /api/auth/login');
      console.log('    GET  /api/auth/profile');
      console.log('\n  Issue Management:');
      console.log('    POST /api/issues');
      console.log('    GET  /api/issues/user');
      console.log('    POST /api/issues/ai-image');
      console.log('    POST /api/issues/ai-voice');
      console.log('\n  Admin Panel:');
      console.log('    GET  /api/admin/issues');
      console.log('    PATCH /api/admin/issues/:id/status');
      console.log('    GET  /api/admin/dashboard');
      console.log('\n🔧 Environment:', process.env.NODE_ENV || 'development');
      console.log('💾 Database:', dbService.getConnectionStatus() ? 'Connected' : 'Disconnected');
      console.log('🤖 AI Service:', aiService.getServiceStatus().status);
      console.log('\n✨ Server is ready to handle requests!');
      console.log('📱 Make sure your phone is connected to the same WiFi network!');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  await dbService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  await dbService.disconnect();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception! Shutting down...');
  console.error(error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection! Shutting down...');
  console.error(reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;