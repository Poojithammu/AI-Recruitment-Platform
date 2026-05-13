const mongoose = require('mongoose');

const leadScoreSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  breakdown: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeadScore', leadScoreSchema);
