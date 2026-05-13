const mongoose = require('mongoose');

const AnalystProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add your area of specialization'],
    trim: true
  },
  industriesCovered: {
    type: [String],
    default: []
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Please add your years of experience']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  preferredTools: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalystProfile', AnalystProfileSchema);
