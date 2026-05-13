const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: {
    type: [String],
    default: []
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', 'lead'],
    required: [true, 'Please specify your experience level']
  },
  currentSalary: {
    type: Number
  },
  expectedSalary: {
    type: Number
  },
  preferredLocations: {
    type: [String],
    default: []
  },
  resumeUrl: {
    type: String
  },
  portfolioUrl: {
    type: String
  },
  isActivelyLooking: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
