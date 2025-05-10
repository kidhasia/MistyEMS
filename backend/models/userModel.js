import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['project_manager', 'editor', 'quality_check', 'general_manager', 'admin'],
      message: '{VALUE} is not a valid role',
    },
    default: 'editor',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;