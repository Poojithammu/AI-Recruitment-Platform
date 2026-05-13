const aiExtractionService = require('../services/ai/aiExtractionService');
const trendAnalysisService = require('../services/analytics/trendAnalysisService');
const Trend = require('../models/Trend');

// @desc    Extract requirements from Job Description
// @route   POST /api/ai/extract-requirements
// @access  Private
const extractRequirements = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: 'jobDescription is required' });
    }

    const extractedData = await aiExtractionService.extractRequirements(jobDescription);
    
    res.json(extractedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze hiring trends
// @route   POST /api/ai/analyze-trends
// @access  Private/Admin
const analyzeTrends = async (req, res) => {
  try {
    const trends = await trendAnalysisService.analyzeHiringTrends();
    res.json({ message: 'Trend analysis completed successfully', trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all trends
// @route   GET /api/trends
// @access  Private
const getTrends = async (req, res) => {
  try {
    const trends = await Trend.find().populate('companyId');
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  extractRequirements,
  analyzeTrends,
  getTrends
};
