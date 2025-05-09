import mongoose from 'mongoose';

const gmtopmtaskSchema = new mongoose.Schema({
  originalTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  instructions: {
    type: String
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'assigned',
    enum: ['assigned', 'in progress', 'completed']
  }
});

const GMToPMTask = mongoose.model('GMToPMTask', gmtopmtaskSchema);
export default GMToPMTask;