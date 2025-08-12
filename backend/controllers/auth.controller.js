const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');


exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash, role });
        const newUser = await user.save();

        res.status(201).json({ msg: "User registered",user:{name: newUser.name, newUser: newUser.role} });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role ,email: user.email}, process.env.JWT_KEY, { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}
