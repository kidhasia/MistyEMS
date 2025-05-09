import { Router } from 'express';
import Task from '../models/task.js';
import multer from 'multer';
import path from 'path';
import summarizeDescription from '../utils/summarize.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter });

// POST: Create new task with AI summary
router.post('/add', upload.single('attachment'), async (req, res) => {
  try {
    const { clientId, description, deadline } = req.body;
    const attachment = req.file ? req.file.path : null;

    const summary = await summarizeDescription(description);

    const newTask = new Task({
      clientId,
      description,
      deadline,
      attachment,
      summary,
    });

    await newTask.save();
    res.status(200).json({ message: 'Task submitted!', task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all tasks
router.get('/all', async (req, res) => {
  try {
    const tasks = await Task.find().populate('clientId', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update task
router.put('/update/:taskId', upload.single('attachment'), async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { clientId, description, deadline } = req.body;
    const attachment = req.file ? req.file.path : null;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (clientId && task.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'You are not allowed to edit this task.' });
    }

    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    if (description) {
      task.summary = await summarizeDescription(description);
    }
    if (attachment) {
      task.attachment = attachment;
    }

    await task.save();
    res.status(200).json({ message: 'Task updated!', task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove task
router.delete('/delete/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { clientId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'You are not allowed to delete this task.' });
    }

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;