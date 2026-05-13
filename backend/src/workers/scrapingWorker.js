const { Worker, Queue } = require('bullmq');
const scraperService = require('../services/scraping/scraperService');
const Job = require('../models/Job');

// Connection to Redis (Ensure Redis is running locally or provide REDIS_URL)
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Create a Queue for Scraping
const scrapingQueue = new Queue('ScrapingQueue', { connection });

// Define the Worker
const scrapingWorker = new Worker('ScrapingQueue', async (job) => {
  console.log(`Processing scraping job ${job.id} for source ${job.data.source}`);
  
  try {
    const scrapedJobs = await scraperService.scrapeJobs(job.data.source, job.data.url);
    
    // Save to DB
    if (scrapedJobs && scrapedJobs.length > 0) {
      for (const jobData of scrapedJobs) {
        // Implement deduplication logic here
        await Job.create({
           ...jobData,
           source: job.data.source
        });
      }
    }
    
    console.log(`Finished scraping job ${job.id}`);
  } catch (error) {
    console.error(`Scraping job ${job.id} failed:`, error);
    throw error;
  }
}, { connection });

scrapingWorker.on('completed', (job) => {
  console.log(`Scraping Job ${job.id} has completed!`);
});

scrapingWorker.on('failed', (job, err) => {
  console.log(`Scraping Job ${job.id} has failed with ${err.message}`);
});

module.exports = {
  scrapingQueue,
  scrapingWorker
};
