const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and restricted to recruiters and admins
router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/', getCompanies);
router.post('/', createCompany);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);

module.exports = router;
