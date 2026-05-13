const express = require('express');
const router = express.Router();
const {
  extractRequirements,
  analyzeTrends,
  getTrends
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/ai/extract-requirements', protect, extractRequirements);
router.post('/ai/analyze-trends', protect, authorize('admin', 'analyst'), analyzeTrends);
router.get('/trends', protect, getTrends);

module.exports = router;
