// routes/task.route.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');
const { verifyToken } = require('../middleware/auth.middle');

// team lead
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'TeamLead') {
      return res.status(403).json({ msg: 'Only TeamLead can assign tasks' });
    }

    const { title, description, assignedTo } = req.body;
    if (!title || !assignedTo) {
      return res.status(400).json({ msg: 'Missing title or assignedTo' });
    }

    const assignedBy = req.user.email || 'unknown@system';

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy
    });

    await task.save();
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});


// Get tasks
// - Intern: only their tasks
// - TeamLead/HR/Founder: all tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Intern') {
      tasks = await Task.find({ assignedTo: req.user.email }).sort({ createdAt: -1 });
    } else {
      tasks = await Task.find().sort({ createdAt: -1 });
    }
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Update task status (TeamLead or assigned Intern)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status, title, description } = req.body; // allow partial updates

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Only TeamLead or the assigned intern can update
    if (req.user.role !== 'TeamLead' && req.user.email !== task.assignedTo) {
      return res.status(403).json({ msg: 'Not authorized to modify this task' });
    }

    if (status) task.status = status;
    if (title) task.title = title;
    if (description) task.description = description;

    await task.save();
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
