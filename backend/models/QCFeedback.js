import mongoose from 'mongoose';

const qcFeedbackSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  qcRemarks: {
    type: String,
    required: true
  },
  editorId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('QCFeedback', qcFeedbackSchema);