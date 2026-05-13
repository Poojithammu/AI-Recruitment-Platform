const { Parser } = require('json2csv');
const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Export Company Data to CSV
// @route   GET /api/reports/export/csv
// @access  Private/Admin
const exportCompanyDataCsv = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    
    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found' });
    }

    const fields = ['companyName', 'website', 'industry', 'hiringScore', 'trend'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(companies);

    res.header('Content-Type', 'text/csv');
    res.attachment('companies_report.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  exportCompanyDataCsv
};
