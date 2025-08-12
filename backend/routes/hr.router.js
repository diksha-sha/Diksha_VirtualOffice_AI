const express = require('express');
const { verifyToken, restrictTo } = require('../middleware/auth.middle');
const Intern = require('../models/Intern.model');

const router = express.Router();

// Create Intern (HR only)
router.post('/interns', verifyToken, restrictTo('HR'), async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const intern = new Intern({ name, email, department });
    await intern.save();
    res.status(201).json(intern);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all interns (HR only)
router.get('/interns', verifyToken, restrictTo('HR'), async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Intern view progress (role check optional)
router.get('/interns/progress/:email', verifyToken, async (req, res) => {
  try {
    const intern = await Intern.findOne({ email: req.params.email });
    if (!intern) return res.status(404).json({ msg: "Intern not found" });
    res.json({ progress: intern.progress });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
