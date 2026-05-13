const mongoose = require('mongoose');

const outreachLogSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recruiter'
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  },
  channel: {
    type: String,
    enum: ['email', 'whatsapp', 'linkedin'],
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'replied'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OutreachLog', outreachLogSchema);
