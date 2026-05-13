const emailService = require('../services/outreach/emailService');
const OutreachLog = require('../models/OutreachLog');
const Recruiter = require('../models/Recruiter');

// @desc    Send Outreach Email
// @route   POST /api/outreach/email
// @access  Private/Admin
const sendOutreachEmail = async (req, res) => {
  try {
    const { recruiterId, subject, message } = req.body;
    
    if (!recruiterId || !subject || !message) {
      return res.status(400).json({ message: 'recruiterId, subject, and message are required' });
    }

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter || !recruiter.email) {
      return res.status(404).json({ message: 'Recruiter or email not found' });
    }

    // Attempt to send email
    await emailService.sendEmail({
      email: recruiter.email,
      subject,
      message
    });

    // Log Outreach
    const log = await OutreachLog.create({
      recruiterId: recruiter._id,
      companyId: recruiter.companyId,
      channel: 'email',
      message: message,
      status: 'sent'
    });

    res.status(200).json({ message: 'Email sent successfully', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOutreachEmail
};
