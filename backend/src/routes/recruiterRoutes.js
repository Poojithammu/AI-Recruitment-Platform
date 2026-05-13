const express = require('express');
const router = express.Router();
const {
  extractRecruiters,
  getRecruiters,
  getRecruiterById
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

router.post('/extract', protect, authorize('admin', 'recruiter'), extractRecruiters);
router.get('/', protect, getRecruiters);
router.get('/:id', protect, getRecruiterById);

module.exports = router;
