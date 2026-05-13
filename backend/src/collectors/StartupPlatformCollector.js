const BaseCollector = require('./BaseCollector');
const logger = require('../utils/logger');

class StartupPlatformCollector extends BaseCollector {
  constructor() {
    super('startup_platform');
    this.targetUrl = 'https://startup.jobs/search?q=Software+Engineer&l=Remote';
  }

  async collect() {
    logger.info('Starting collection from Startup Jobs...');
    const browser = await this.getBrowser();
    const jobs = [];

    try {
      const context = await browser.newContext({ userAgent: this.userAgent });
      const page = await context.newPage();
      
      await page.goto(this.targetUrl, { waitUntil: 'networkidle' });

      const jobCards = await page.$$('div.relative.flex.items-center.gap-2.py-4');

      for (const card of jobCards) {
        try {
          const titleLink = await card.$('a[class*="leading-tight"]');
          const title = await titleLink.innerText().catch(() => '');
          const url = await titleLink.getAttribute('href').catch(() => '');
          const company = await card.$eval('a[href^="/company/"]', el => el.innerText.trim()).catch(() => '');
          
          if (title && company) {
            jobs.push({
              source: this.sourceName,
              sourceJobId: Buffer.from(company + title).toString('base64'),
              sourceUrl: url.startsWith('http') ? url : `https://startup.jobs${url}`,
              companyName: company,
              jobRole: title,
              hiringLocation: 'Remote',
              jobDescription: `${title} role at startup ${company}`,
              postedDate: new Date()
            });
          }
        } catch (e) {
          // logger.warn(`Error parsing startup job: ${e.message}`);
        }
      }
    } catch (error) {
      logger.error(`StartupPlatformCollector error: ${error.message}`);
    } finally {
      await browser.close();
    }

    return jobs;
  }
}

module.exports = StartupPlatformCollector;
