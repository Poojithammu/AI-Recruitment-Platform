const cron = require('node-cron');
const crawlerOrchestrator = require('../services/hiring/CrawlerOrchestrator');
const logger = require('../utils/logger');

// Run collection every 6 hours
// 0 */6 * * *
const scheduleHiringCollection = () => {
  // Perform an initial collection on startup
  const runCollection = async () => {
    logger.info('Starting hiring data collection (Initial/Scheduled)...');
    try {
      const summary = await crawlerOrchestrator.runAll();
      if (summary) {
        logger.info('Collection completed: %o', summary);
      }
    } catch (error) {
      logger.error(`Collection failed: ${error.message}`);
    }
  };

  // Run immediately on startup
  runCollection();

  // Schedule to run every 6 hours
  // 0 */6 * * *
  cron.schedule('0 */6 * * *', runCollection);
  
  logger.info('Hiring data collection scheduled: every 6 hours.');
};

module.exports = scheduleHiringCollection;
