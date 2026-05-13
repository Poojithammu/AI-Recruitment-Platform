const mongoose = require('mongoose');

const RecruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add your company name'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please add your designation'],
    trim: true
  },
  hiringFocus: {
    type: [String],
    default: []
  },
  linkedInUrl: {
    type: String,
    match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please add a valid LinkedIn URL']
  },
  officeLocation: {
    type: String,
    trim: true
  },
  isVerifiedRecruiter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RecruiterProfile', RecruiterProfileSchema);
