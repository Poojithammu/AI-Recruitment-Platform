const express = require('express');
const router = express.Router();
const { exportCompanyDataCsv } = require('../controllers/reportsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/export/csv', protect, authorize('admin', 'analyst'), exportCompanyDataCsv);

module.exports = router;
