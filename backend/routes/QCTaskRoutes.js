import express from 'express';
import mongoose from 'mongoose';
import QCTask from '../models/QCTask.js'; // Updated to ES Modules
import sendEmail from '../utils/sendEmail.js'; // Adjust path as necessary

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await QCTask.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  const task = new QCTask({
    name: req.body.name,
    description: req.body.description,
    deadline: req.body.deadline,
    status: 'Pending',
    assignedTo: req.body.assignedTo
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update task status
router.patch('/:id/status', async (req, res) => {
  const taskId = req.params.id;
  const { status, remarks, deadline, email } = req.body;

  console.log('🔹 Received Update Request:', {
    taskId,
    status,
    remarks,
    deadline,
    email
  });

  // Validate if taskId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    console.error('❌ Invalid Task ID:', taskId);
    return res.status(400).json({ error: 'Invalid Task ID format' });
  }

  try {
    const updatedTask = await QCTask.findByIdAndUpdate(
      taskId,
      { status, remarks, deadline },
      { new: true }
    );

    if (!updatedTask) {
      console.error('❌ Task Not Found:', taskId);
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if this is a revision request
    if (status.toLowerCase() === 'needs revision' && remarks && email) {
      try {
        const subject = `Revision Required: ${updatedTask.name}`;
        const text =
          `Hello,\n\n` +
          `Your task "${updatedTask.name}" requires revision.\n\n` +
          `Remarks: ${remarks}\n` +
          `New Deadline: ${deadline}\n\n` +
          `Please update by the new deadline.\n\n` +
          `— QC Team`;

        console.log('📧 Attempting to send email to:', email);
        await sendEmail(email, subject, text);
        console.log('📧 Email sent successfully to', email);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        return res.status(200).json({
          task: updatedTask,
          warning: 'Task updated but email notification failed'
        });
      }
    }

    console.log('✅ Task Updated Successfully:', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// POST send email
router.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Please provide to, subject, and text.' });
  }

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
});

// DELETE task by ID
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ObjectId format',
        received: taskId
      });
    }

    // Delete task
    const result = await QCTask.findByIdAndDelete(taskId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;