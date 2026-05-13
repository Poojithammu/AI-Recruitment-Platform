const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  },
  trendType: {
    type: String
  },
  score: {
    type: Number
  },
  analysis: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trend', trendSchema);
