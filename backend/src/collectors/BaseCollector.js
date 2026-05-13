const playwright = require('playwright');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

class BaseCollector {
  constructor(sourceName) {
    this.sourceName = sourceName;
    this.userAgent = process.env.CRAWLER_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  async fetchWithAxios(url) {
    return await axios.get(url, {
      headers: { 'User-Agent': this.userAgent },
      timeout: parseInt(process.env.CRAWLER_TIMEOUT) || 30000
    });
  }

  async getBrowser() {
    return await playwright.chromium.launch({
      headless: process.env.PLAYWRIGHT_HEADLESS !== 'false'
    });
  }
  
  // To be implemented by subclasses
  async collect() {
    throw new Error('collect() must be implemented');
  }
}

module.exports = BaseCollector;
