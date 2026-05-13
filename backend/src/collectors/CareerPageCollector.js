const cheerio = require('cheerio');
const BaseCollector = require('./BaseCollector');
const logger = require('../utils/logger');

class CareerPageCollector extends BaseCollector {
  constructor() {
    super('career_page');
    // Example URLs - in production these might come from a DB or config
    this.targetUrls = [
      'https://www.google.com/about/careers/applications/jobs/results/',
      'https://www.metacareers.com/jobs',
      'https://www.amazon.jobs/en/search'
    ];
  }

  async collect() {
    logger.info('Starting collection from Company Career Pages...');
    const jobs = [];

    for (const url of this.targetUrls) {
      try {
        const response = await this.fetchWithAxios(url);
        const $ = cheerio.load(response.data);

        // Generic parsing logic - in reality, each career page might need a specific parser
        // or a more sophisticated AI-based parser
        $('.job-listing, .job-item, tr.job').each((i, el) => {
          const title = $(el).find('.job-title, h3, a').first().text().trim();
          const location = $(el).find('.location, .job-location').text().trim();
          const jobUrl = $(el).find('a').attr('href');

          if (title) {
            jobs.push({
              source: this.sourceName,
              sourceJobId: Buffer.from(url + title).toString('base64'),
              sourceUrl: jobUrl ? (jobUrl.startsWith('http') ? jobUrl : new URL(jobUrl, url).href) : url,
              companyName: this.extractCompanyName(url),
              jobRole: title,
              hiringLocation: location,
              jobDescription: `Job at ${this.extractCompanyName(url)}: ${title}`,
              postedDate: new Date()
            });
          }
        });
      } catch (error) {
        logger.error(`Error collecting from ${url}: ${error.message}`);
      }
    }

    return jobs;
  }

  extractCompanyName(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch (e) {
      return 'Unknown Company';
    }
  }
}

module.exports = CareerPageCollector;
