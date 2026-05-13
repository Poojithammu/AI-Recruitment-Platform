const BaseCollector = require('./BaseCollector');
const logger = require('../utils/logger');

class LinkedInCollector extends BaseCollector {
  constructor() {
    super('linkedin');
    this.targetUrl = 'https://www.linkedin.com/jobs/search?keywords=Software%20Engineer&location=Remote';
  }

  async collect() {
    logger.info('Starting collection from LinkedIn...');
    const browser = await this.getBrowser();
    const jobs = [];

    try {
      const context = await browser.newContext({ userAgent: this.userAgent });
      const page = await context.newPage();
      
      // Use guest view or restricted view for public listings
      await page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });

      // LinkedIn often requires scrolling to load more
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      const jobCards = await page.$$('.jobs-search__results-list li');

      for (const card of jobCards) {
        try {
          const title = await card.$eval('.base-search-card__title', el => el.innerText.trim()).catch(() => '');
          const company = await card.$eval('.base-search-card__subtitle', el => el.innerText.trim()).catch(() => '');
          const location = await card.$eval('.job-search-card__location', el => el.innerText.trim()).catch(() => '');
          const url = await card.$eval('.base-card__full-link', el => el.href).catch(() => this.targetUrl);
          const id = await card.getAttribute('data-entity-urn').catch(() => '').then(urn => urn ? urn.split(':').pop() : '');

          if (title && company) {
            jobs.push({
              source: this.sourceName,
              sourceJobId: id || Buffer.from(company + title).toString('base64'),
              sourceUrl: url,
              companyName: company,
              jobRole: title,
              hiringLocation: location,
              jobDescription: `${title} engineering position at ${company}`,
              postedDate: new Date()
            });
          }
        } catch (e) {
          // logger.warn(`Error parsing LinkedIn job card: ${e.message}`);
        }
      }
    } catch (error) {
      logger.error(`LinkedInCollector error: ${error.message}`);
    } finally {
      await browser.close();
    }

    return jobs;
  }
}

module.exports = LinkedInCollector;
