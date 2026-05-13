const RequirementExtraction = require('../models/RequirementExtraction');
const aiRequirementService = require('../services/ai/aiRequirementService');
const logger = require('../utils/logger');

// @desc    Extract requirements from a job description
// @route   POST /api/requirements/extract
// @access  Private
exports.extractRequirements = async (req, res) => {
  const { jobDescription, provider } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ success: false, message: 'Job description is required' });
  }

  try {
    const result = await aiRequirementService.extractRequirements(jobDescription, provider);

    const extraction = await RequirementExtraction.create({
      userId: req.user._id,
      rawDescription: jobDescription,
      extractedData: result.success ? result.data : null,
      aiProvider: provider || 'gemini',
      processingStatus: result.success ? 'completed' : 'failed',
      processingTime: result.processingTime,
      error: result.success ? null : result.error
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'AI Extraction failed',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      data: extraction
    });
  } catch (error) {
    logger.error('Error in extractRequirements controller:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Extract requirements in batch
// @route   POST /api/requirements/extract-batch
// @access  Private
exports.extractBatch = async (req, res) => {
  const { jobs } = req.body;

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return res.status(400).json({ success: false, message: 'Jobs array is required' });
  }

  if (jobs.length > 10) {
    return res.status(400).json({ success: false, message: 'Batch size limit exceeded (max 10)' });
  }

  try {
    const results = await Promise.all(jobs.map(async (job) => {
      const result = await aiRequirementService.extractRequirements(job.description);
      return await RequirementExtraction.create({
        userId: req.user._id,
        jobId: job.jobId,
        rawDescription: job.description,
        extractedData: result.success ? result.data : null,
        processingStatus: result.success ? 'completed' : 'failed',
        processingTime: result.processingTime
      });
    }));

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Batch processing failed' });
  }
};

// @desc    Get extraction history
// @route   GET /api/requirements/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const history = await RequirementExtraction.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};

// @desc    Get single extraction by ID
// @route   GET /api/requirements/:id
// @access  Private
exports.getExtractionById = async (req, res) => {
  try {
    const extraction = await RequirementExtraction.findById(req.params.id);
    if (!extraction) {
      return res.status(404).json({ success: false, message: 'Extraction not found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && extraction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: extraction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reprocess a failed extraction
// @route   POST /api/requirements/reprocess/:id
// @access  Private
exports.reprocess = async (req, res) => {
  try {
    const extraction = await RequirementExtraction.findById(req.params.id);
    if (!extraction) {
      return res.status(404).json({ success: false, message: 'Extraction not found' });
    }

    const result = await aiRequirementService.extractRequirements(extraction.rawDescription);
    
    extraction.extractedData = result.success ? result.data : null;
    extraction.processingStatus = result.success ? 'completed' : 'failed';
    extraction.processingTime = result.processingTime;
    extraction.error = result.success ? null : result.error;
    
    await extraction.save();

    res.json({ success: true, data: extraction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reprocessing failed' });
  }
};
