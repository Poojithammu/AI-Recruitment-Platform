const express = require('express');
const router = express.Router();
const {
  calculateScore,
  getLeadScores
} = require('../controllers/leadScoreController');
const { protect, authorize } = require('../middleware/auth');

router.post('/calculate', protect, authorize('admin', 'analyst'), calculateScore);
router.get('/', protect, getLeadScores);

module.exports = router;
