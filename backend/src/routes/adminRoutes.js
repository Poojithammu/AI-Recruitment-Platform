const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getAllJobs, 
  updateJob, 
  deleteJob,
  getStats
} = require('../controllers/adminController');
const { authenticateUser } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// All routes are protected and restricted to admin
router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobs);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

router.get('/stats', getStats);

module.exports = router;
