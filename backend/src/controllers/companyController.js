const Company = require('../models/Company');
const HiringJob = require('../models/HiringJob');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyName: 1 });
    
    // Enrich with active job counts (optional but helpful for the list)
    const enrichedCompanies = await Promise.all(companies.map(async (company) => {
      const activeJobs = await HiringJob.countDocuments({ companyId: company._id, isActive: true });
      return {
        ...company.toObject(),
        activeJobs
      };
    }));

    res.json(enrichedCompanies);
  } catch (error) {
    console.error('GET_COMPANIES_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Fetch active jobs for this company
    const jobs = await HiringJob.find({ companyId: company._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      ...company.toObject(),
      jobs
    });
  } catch (error) {
    console.error('GET_COMPANY_BY_ID_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
