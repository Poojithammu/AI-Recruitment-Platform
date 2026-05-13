const express = require('express');
const router = express.Router();
const hiringController = require('../controllers/hiring.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.use(authenticateUser);

router.post(
  '/collect', 
  authorizeRoles('admin', 'recruiter', 'analyst'), 
  hiringController.collectJobs
);

router.post(
  '/jobs',
  authorizeRoles('admin', 'recruiter'),
  hiringController.createJob
);

router.get(
  '/jobs', 
  hiringController.getJobs
);

router.get(
  '/jobs/:id', 
  hiringController.getJobById
);

router.delete(
  '/jobs/:id', 
  authorizeRoles('admin'), 
  hiringController.deleteJob
);

router.get(
  '/stats', 
  hiringController.getStats
);

module.exports = router;
