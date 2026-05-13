const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add a company name']
  },
  website: {
    type: String
  },
  industry: {
    type: String
  },
  companySize: {
    type: String
  },
  hiringScore: {
    type: Number,
    default: 0
  },
  trend: {
    type: String
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
