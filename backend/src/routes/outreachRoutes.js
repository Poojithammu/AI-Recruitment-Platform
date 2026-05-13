const express = require('express');
const router = express.Router();
const { sendOutreachEmail } = require('../controllers/outreachController');
const { protect, authorize } = require('../middleware/auth');

router.post('/email', protect, authorize('admin', 'recruiter'), sendOutreachEmail);

module.exports = router;
