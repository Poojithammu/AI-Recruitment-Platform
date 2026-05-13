const IndeedCollector = require('../src/collectors/IndeedCollector');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testIndeed = async () => {
  const collector = new IndeedCollector();
  console.log(`Testing ${collector.sourceName} crawler...`);
  console.log(`Target URL: ${collector.targetUrl}`);
  
  try {
    const jobs = await collector.collect();
    console.log(`Successfully extracted ${jobs.length} jobs.`);
    if (jobs.length > 0) {
      console.log('Sample extracted data:', JSON.stringify(jobs[0], null, 2));
    } else {
      console.log('No jobs found. This might be due to outdated selectors or bot detection.');
    }
  } catch (error) {
    console.error('Crawler failed:', error);
  }
};

testIndeed();
