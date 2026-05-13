const mongoose = require('mongoose');

const RequirementExtractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobId: {
    type: String,
    index: true
  },
  rawDescription: {
    type: String,
    required: true
  },
  extractedData: {
    role: String,
    skills: [String],
    preferredSkills: [String],
    experience: {
      min: Number,
      max: Number,
      text: String
    },
    location: String,
    salary: {
      min: Number,
      max: Number,
      currency: String
    },
    employmentType: String,
    education: [String],
    certifications: [String],
    responsibilities: [String],
    industry: String
  },
  aiProvider: {
    type: String,
    enum: ['gemini', 'openai'],
    default: 'gemini'
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  processingTime: {
    type: Number // in milliseconds
  },
  error: String
}, {
  timestamps: true
});

module.exports = mongoose.model('RequirementExtraction', RequirementExtractionSchema);
