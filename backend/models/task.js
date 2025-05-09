import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const autoIncrementPlugin = AutoIncrement(mongoose);

const taskSchema = new mongoose.Schema({
  taskId: {
    type: Number,
    unique: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  attachment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.plugin(autoIncrementPlugin, { inc_field: 'taskId' });

const Task = mongoose.model('Task', taskSchema, 'ctogmtask');
export default Task;