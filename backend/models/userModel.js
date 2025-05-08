const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define allowed roles based on the frontend roleRoutes
const ROLES = [
  'editor',
  'quality_control',
  'project_manager',
  'general_manager',
  'admin'
];

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ROLES,
      message: 'Invalid role. Must be one of: ' + ROLES.join(', ')
    },
    default: 'editor' // Default role for new users
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password and update timestamps
userSchema.pre('save', async function (next) {
  // Update timestamps
  this.updatedAt = Date.now();
  if (this.isNew) {
    this.createdAt = Date.now();
  }

  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;