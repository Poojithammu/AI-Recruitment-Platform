const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },
  email: {
    type: String
  },
  linkedin: {
    type: String
  },
  phone: {
    type: String
  },
  source: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
