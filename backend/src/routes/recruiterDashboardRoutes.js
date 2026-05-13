const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/recruiterDashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/stats', dashboardController.getStats);
router.get('/hiring-trends', dashboardController.getHiringTrends);
router.get('/tech-demand', dashboardController.getTechDemand);
router.get('/recent-jobs', dashboardController.getRecentJobs);
router.get('/alerts', dashboardController.getAlerts);

module.exports = router;
