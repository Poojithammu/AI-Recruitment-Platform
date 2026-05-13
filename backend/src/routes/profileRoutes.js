const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, createOrUpdateProfile } = require('../controllers/profileController');

router.get('/me', protect, getProfile);
router.post('/', protect, createOrUpdateProfile);

module.exports = router;
