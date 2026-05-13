const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: false // Optional initially before linking
  },
  role: {
    type: String,
    required: [true, 'Please add a job role']
  },
  skills: {
    type: [String]
  },
  experience: {
    type: String
  },
  location: {
    type: String
  },
  salary: {
    type: String
  },
  jobDescription: {
    type: String
  },
  jobUrl: {
    type: String
  },
  postedDate: {
    type: Date
  },
  source: {
    type: String
  },
  aiExtractedData: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
