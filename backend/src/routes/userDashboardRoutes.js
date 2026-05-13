const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getJobs, getCompanies, scrutinizeResume, getStats } = require('../controllers/userDashboardController');
const { authenticateUser } = require('../middleware/auth.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(authenticateUser);

router.get('/jobs', getJobs);
router.get('/companies', getCompanies);
router.get('/stats', getStats);
router.post('/scrutinize-resume', upload.single('resume'), scrutinizeResume);

module.exports = router;
