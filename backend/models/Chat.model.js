const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    author: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Auto-delete after 24 hours
chatMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
