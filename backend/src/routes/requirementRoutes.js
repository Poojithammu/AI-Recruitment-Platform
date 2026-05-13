const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  extractRequirements,
  extractBatch,
  getHistory,
  getExtractionById,
  reprocess
} = require('../controllers/requirementController');

// All routes are protected
router.use(protect);

router.post('/extract', authorize('admin', 'recruiter', 'analyst', 'user'), extractRequirements);
router.post('/extract-batch', authorize('admin', 'recruiter', 'analyst'), extractBatch);
router.get('/history', getHistory);
router.get('/:id', getExtractionById);
router.post('/reprocess/:id', authorize('admin', 'recruiter'), reprocess);

module.exports = router;
