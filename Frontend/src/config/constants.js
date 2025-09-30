// API Configuration
// Updated for phone network access - use your machine's IP when running on phone
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.118:3000/api' 
  : 'https://your-production-api.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Issues
  ISSUES: {
    BASE: '/issues',
    USER: '/issues/user',
    PUBLIC: '/issues/public',
    NEARBY: '/issues/nearby',
    UPLOAD_PHOTO: '/issues/upload/photo',
    UPLOAD_VOICE: '/issues/upload/voice',
    AI_IMAGE: '/issues/ai-image',
    AI_VOICE: '/issues/ai-voice',
    CLASSIFY_IMAGE: '/issues/classify-image',
    TRANSCRIBE_VOICE: '/issues/transcribe-voice',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ISSUES: '/admin/issues',
    USERS: '/admin/users',
  },
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'CivicSight-AI',
  VERSION: '1.0.0',
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  SUPPORTED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Issue Categories - Imported from categories.js
export { ISSUE_CATEGORIES } from './categories';

// Issue Status
export const ISSUE_STATUS = {
  PENDING: { label: 'Pending', color: '#f59e0b', icon: '⏳' },
  VERIFIED: { label: 'Verified', color: '#3b82f6', icon: '✅' },
  IN_PROGRESS: { label: 'In Progress', color: '#8b5cf6', icon: '🔧' },
  RESOLVED: { label: 'Resolved', color: '#10b981', icon: '✅' },
  REJECTED: { label: 'Rejected', color: '#ef4444', icon: '❌' },
};

// Priority Levels
export const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low', color: '#3b82f6', icon: '🔵' },
  { id: 'medium', label: 'Medium', color: '#f59e0b', icon: '🟡' },
  { id: 'high', label: 'High', color: '#ef4444', icon: '🔴' },
];

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LOCATION_DATA: 'location_data',
};

// Default Location (Cracow, Poland - as shown in the reference image)
export const DEFAULT_LOCATION = {
  latitude: 49.981636,
  longitude: 19.944382,
  address: 'st. Herbowa, Swoszowice',
  city: 'Cracow',
};