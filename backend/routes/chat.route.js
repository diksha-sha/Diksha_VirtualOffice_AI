const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/Chat.model');
const {verifyToken} = require('../middleware/auth.middle');

router.get('/today', verifyToken, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const messages = await ChatMessage.find({
      createdAt: { $gte: startOfDay }
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
