import { Router } from 'express';
import mongoose from 'mongoose';
import GMToPMTask from '../models/gmtopmtask.js';

const router = Router();

router.post('/assign', async (req, res) => {
  try {
    const { originalTaskId, assignedBy, assignedTo, instructions } = req.body;

    const newAssignment = new GMToPMTask({
      originalTaskId,
      assignedBy,
      assignedTo,
      instructions,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Task assigned to PM!', task: newAssignment });
  } catch (err) {
    console.error('Assignment Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/assigned/:pmId', async (req, res) => {
  try {
    const pmId = req.params.pmId;

    const assignedTasks = await GMToPMTask.find({
      assignedTo: new mongoose.Types.ObjectId(pmId),
    })
      .populate('originalTaskId')
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json(assignedTasks);
  } catch (err) {
    console.error('Fetch Error (/assigned/:pmId):', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;