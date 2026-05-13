const express = require('express');
const router = express.Router();
const {
  triggerScrape,
  getJobs,
  getJobById
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.post('/scrape', protect, authorize('admin', 'recruiter'), triggerScrape);
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);

module.exports = router;
