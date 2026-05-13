const mongoose = require('mongoose');

const HiringJobSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    index: true,
    enum: ['career_page', 'startup_platform', 'indeed', 'naukri', 'linkedin', 'instahyre', 'manual']
  },
  sourceJobId: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  requiredSkills: [{
    type: String,
    index: true
  }],
  experienceRequired: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    raw: { type: String }
  },
  hiringLocation: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    remote: { type: Boolean, default: false }
  },
  recruiterDetails: {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },
  jobDescription: {
    type: String,
    required: true
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'contract', 'internship', 'freelance', 'hybrid', 'other'],
    default: 'full-time'
  },
  postedDate: {
    type: Date,
    index: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hash: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for common search queries
HiringJobSchema.index({ companyName: 'text', jobRole: 'text', jobDescription: 'text' });
HiringJobSchema.index({ 'hiringLocation.city': 1, 'hiringLocation.country': 1 });

module.exports = mongoose.model('HiringJob', HiringJobSchema);
