const recruiterService = require('../services/recruiters/recruiterService');
const Recruiter = require('../models/Recruiter');

// @desc    Extract recruiters
// @route   POST /api/recruiters/extract
// @access  Private/Admin
const extractRecruiters = async (req, res) => {
  try {
    const { companyId, sourceData } = req.body;
    const recruiter = await recruiterService.extractRecruiterContacts(companyId, sourceData);
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all recruiters
// @route   GET /api/recruiters
// @access  Private
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().populate('companyId');
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter by ID
// @route   GET /api/recruiters/:id
// @access  Private
const getRecruiterById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id).populate('companyId');
    if (recruiter) {
      res.json(recruiter);
    } else {
      res.status(404).json({ message: 'Recruiter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  extractRecruiters,
  getRecruiters,
  getRecruiterById
};
