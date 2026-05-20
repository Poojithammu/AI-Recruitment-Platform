const logger = require('../../utils/logger');

class ResilienceService {
  static async retry(fn, source, options = {}) {
    const {
      maxRetries = parseInt(process.env.CRAWLER_RETRY_LIMIT) || 3,
      initialDelay = 1000,
      factor = 2
    } = options;

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const delay = initialDelay * Math.pow(factor, i);
        
        logger.warn(`Retry attempt ${i + 1}/${maxRetries} for ${source}. Error: ${error.message}. Retrying in ${delay}ms...`);
        
        // Handle specific status codes
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 429) {
            logger.error(`${source} blocked/limited. Status: ${error.response.status}`);
          }
        }

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error(`Max retries reached for ${source}. Final error: ${lastError.message}`);
    throw lastError;
  }
}

module.exports = ResilienceService;
