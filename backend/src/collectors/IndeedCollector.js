const BaseCollector = require('./BaseCollector');
const logger = require('../utils/logger');

class IndeedCollector extends BaseCollector {
  constructor() {
    super('indeed');
    this.targetUrl = 'https://www.indeed.com/m/jobs?q=software+developer&l=remote';
  }

  async collect() {
    logger.info('Starting collection from Indeed...');
    const browser = await this.getBrowser();
    const jobs = [];

    try {
      const context = await browser.newContext({ userAgent: this.userAgent });
      const page = await context.newPage();
      
      await page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });

      // Handle common Indeed overlays or popups
      await page.click('#popover-x', { timeout: 2000 }).catch(() => {});

      const jobCards = await page.$$('.job_seen_beacon');

      for (const card of jobCards) {
        try {
          const title = await card.$eval('.jcs-JobTitle', el => el.innerText.trim()).catch(() => '');
          const company = await card.$eval('[data-testid="company-name"]', el => el.innerText.trim()).catch(() => '');
          const location = await card.$eval('[data-testid="text-location"]', el => el.innerText.trim()).catch(() => '');
          const id = await card.$eval('a[data-jk]', el => el.getAttribute('data-jk')).catch(() => '');
          
          if (title && company) {
            jobs.push({
              source: this.sourceName,
              sourceJobId: id || Buffer.from(company + title).toString('base64'),
              sourceUrl: id ? `https://www.indeed.com/viewjob?jk=${id}` : this.targetUrl,
              companyName: company,
              jobRole: title,
              hiringLocation: location,
              jobDescription: `${title} position at ${company}`,
              postedDate: new Date()
            });
          }
        } catch (e) {
          // logger.warn(`Error parsing Indeed job card: ${e.message}`);
        }
      }
    } catch (error) {
      logger.error(`IndeedCollector error: ${error.message}`);
    } finally {
      await browser.close();
    }

    return jobs;
  }
}

module.exports = IndeedCollector;
