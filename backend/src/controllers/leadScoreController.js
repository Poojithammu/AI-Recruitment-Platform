const leadScoringService = require('../services/scoring/leadScoringService');
const LeadScore = require('../models/LeadScore');

// @desc    Calculate lead score for a company
// @route   POST /api/lead-score/calculate
// @access  Private/Admin
const calculateScore = async (req, res) => {
  try {
    const { companyId } = req.body;
    
    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required' });
    }

    const leadScore = await leadScoringService.calculateLeadScore(companyId);
    res.json(leadScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lead scores
// @route   GET /api/lead-score
// @access  Private
const getLeadScores = async (req, res) => {
  try {
    const leadScores = await LeadScore.find().populate('companyId').sort({ score: -1 });
    res.json(leadScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateScore,
  getLeadScores
};
