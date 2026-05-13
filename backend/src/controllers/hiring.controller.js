const hiringService = require('../services/hiring/HiringService');
const crawlerOrchestrator = require('../services/hiring/CrawlerOrchestrator');
const logger = require('../utils/logger');

exports.collectJobs = async (req, res, next) => {
  try {
    // Run in background so request doesn't timeout
    crawlerOrchestrator.runAll().catch(err => {
      logger.error(`Background crawling failed: ${err.message}`);
    });

    res.status(202).json({
      success: true,
      message: 'Job collection started in the background'
    });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await hiringService.createJob(req.body);
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const result = await hiringService.getJobs(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await hiringService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await hiringService.deleteJob(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await hiringService.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
