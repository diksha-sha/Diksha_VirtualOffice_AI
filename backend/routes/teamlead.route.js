// routes/teamlead.route.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');
const {verifyToken} = require('../middleware/auth.middle');

router.get('/tasks', verifyToken, async (req, res) => {
  try {
    // Only fetch tasks assigned by the logged-in Team Lead
    const tasks = await Task.find({ assignedBy: req.user.email });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
