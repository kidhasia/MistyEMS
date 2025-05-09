import mongoose from 'mongoose';

const qcUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true // Ensure emails are stored in lowercase for consistency
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['QC', 'Editor', 'Project Manager']
    }
  },
  {
    collection: 'users' // Force usage of the existing collection
  }
);

// Indexes for better query performance
qcUserSchema.index({ email: 1 }); // Index on email for faster lookups
qcUserSchema.index({ role: 1 }); // Index on role for filtering by role

export default mongoose.model('QCUser', qcUserSchema);