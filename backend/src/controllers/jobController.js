const Job = require('../models/Job');
const { scrapingQueue } = require('../workers/scrapingWorker');

// @desc    Trigger a scraping job
// @route   POST /api/jobs/scrape
// @access  Private/Admin
const triggerScrape = async (req, res) => {
  try {
    const { source, url } = req.body;
    
    if (!source || !url) {
      return res.status(400).json({ message: 'Source and URL are required' });
    }

    const job = await scrapingQueue.add('scrape', { source, url });

    res.status(202).json({
      message: 'Scraping job added to queue',
      jobId: job.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  triggerScrape,
  getJobs,
  getJobById
};
