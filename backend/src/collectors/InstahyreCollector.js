const BaseCollector = require('./BaseCollector');
const logger = require('../utils/logger');

class InstahyreCollector extends BaseCollector {
  constructor() {
    super('instahyre');
    this.targetUrl = 'https://www.instahyre.com/search-jobs/';
  }

  async collect() {
    logger.info('Starting collection from Instahyre...');
    const browser = await this.getBrowser();
    const jobs = [];

    try {
      const context = await browser.newContext({ userAgent: this.userAgent });
      const page = await context.newPage();
      
      await page.goto(this.targetUrl, { waitUntil: 'networkidle' });

      // Wait for job cards to load
      await page.waitForSelector('a.row.text-link', { timeout: 15000 }).catch(() => {});

      const jobCards = await page.$$('a.row.text-link');

      for (const card of jobCards) {
        try {
          const rawTitle = await card.$eval('.employer-job-name', el => el.innerText.trim()).catch(() => '');
          
          // Instahyre title format: "Company - Job Role"
          let company = '';
          let role = '';
          if (rawTitle.includes(' - ')) {
            [company, role] = rawTitle.split(' - ').map(s => s.trim());
          } else {
            company = rawTitle;
            role = rawTitle;
          }

          const location = await card.$eval('.employer-locations', el => el.innerText.trim()).catch(() => '');
          const url = await card.getAttribute('href').catch(() => '');
          const fullUrl = url ? (url.startsWith('http') ? url : `https://www.instahyre.com${url}`) : this.targetUrl;

          if (role && company) {
            jobs.push({
              source: this.sourceName,
              sourceJobId: Buffer.from(company + role).toString('base64'),
              sourceUrl: fullUrl,
              companyName: company,
              jobRole: role,
              hiringLocation: location.replace('Job available in ', ''),
              jobDescription: `${role} position at ${company}. Location: ${location}`,
              postedDate: new Date()
            });
          }
        } catch (e) {
          // logger.warn(`Error parsing Instahyre job card: ${e.message}`);
        }
      }
    } catch (error) {
      logger.error(`InstahyreCollector error: ${error.message}`);
    } finally {
      await browser.close();
    }

    return jobs;
  }
}

module.exports = InstahyreCollector;
