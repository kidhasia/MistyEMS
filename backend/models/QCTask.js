import mongoose from 'mongoose';

const qcTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low' // Added default to avoid undefined values
    },
    deadline: {
      type: Date
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EditorTask'
    },
    assignedTo: {
      type: String,
      trim: true
    },
    qcStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Needs Revision'],
      default: 'Pending'
    },
    qcRemarks: {
      type: String,
      default: '',
      trim: true
    },
    revisionDeadline: {
      type: Date
    },
    attachments: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
qcTaskSchema.index({ submittedBy: 1 });
qcTaskSchema.index({ qcStatus: 1 });
qcTaskSchema.index({ status: 1 });
qcTaskSchema.index({ deadline: -1 });

export default mongoose.model('QCTask', qcTaskSchema);