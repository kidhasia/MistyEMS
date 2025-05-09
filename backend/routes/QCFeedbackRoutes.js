import express from 'express';
import QCFeedback from '../models/QCFeedback.js'; // Updated to ES Modules import

const router = express.Router();

// POST /api/qc-feedback - Create QC feedback for a task
router.post('/', async (req, res) => {
  const qcFeedback = new QCFeedback({
    taskId: req.body.taskId,
    qcRemarks: req.body.qcRemarks,
    editorId: req.body.editorId
  });

  try {
    const savedQCFeedback = await qcFeedback.save();
    res.status(201).json(savedQCFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/qc-feedback/:taskId - Fetch QC feedback for a specific task
router.get('/:taskId', async (req, res) => {
  try {
    const qcFeedback = await QCFeedback.find({ taskId: req.params.taskId });
    if (qcFeedback.length === 0) {
      return res.status(404).json({ message: 'QC Feedback not found' });
    }
    res.json(qcFeedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/qc-feedback/:feedbackId - Update QC feedback
router.put('/:feedbackId', async (req, res) => {
  try {
    const updatedQCFeedback = await QCFeedback.findByIdAndUpdate(
      req.params.feedbackId,
      {
        qcRemarks: req.body.qcRemarks,
        editorId: req.body.editorId
      },
      { new: true } // Return the updated feedback
    );
    if (!updatedQCFeedback) {
      return res.status(404).json({ message: 'QC Feedback not found' });
    }
    res.json(updatedQCFeedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/qc-feedback/:feedbackId - Delete QC feedback
router.delete('/:feedbackId', async (req, res) => {
  try {
    const deletedQCFeedback = await QCFeedback.findByIdAndDelete(req.params.feedbackId);
    if (!deletedQCFeedback) {
      return res.status(404).json({ message: 'QC Feedback not found' });
    }
    res.json({ message: 'QC Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;