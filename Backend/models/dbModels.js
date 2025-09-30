const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Represents users in the system (both regular users and admins)
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Issue Schema
 * Represents civic issues reported by users
 */
const IssueSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING'
  },
  mediaUrl: {
    type: String,
    trim: true
  },
  latitude: {
    type: Number,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: {
    type: Number,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Pre-save middleware for User schema
 * Hashes password before saving
 */
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method to get user data without password
 * @returns {Object} - User object without password
 */
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create and export models
const User = mongoose.model('User', UserSchema);
const Issue = mongoose.model('Issue', IssueSchema);

module.exports = {
  User,
  Issue
};
