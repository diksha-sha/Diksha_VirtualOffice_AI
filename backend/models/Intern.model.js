const mongoose = require('mongoose');

const InternSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  progress: {
    type: Number,
    default: 0 // percent complete
  }
});

module.exports = mongoose.model('Intern', InternSchema);
