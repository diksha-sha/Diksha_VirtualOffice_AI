// routes/intern.route.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');
const {verifyToken} = require('../middleware/auth.middle');

// Get all tasks for the logged-in intern
router.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.email }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update task status
router.put('/tasks/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.email },
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
