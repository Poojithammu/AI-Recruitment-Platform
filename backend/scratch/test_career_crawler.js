const CareerPageCollector = require('../src/collectors/CareerPageCollector');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testCareerPage = async () => {
  const collector = new CareerPageCollector();
  console.log(`Testing ${collector.sourceName} crawler...`);
  console.log(`Target URLs: ${collector.targetUrls.join(', ')}`);
  
  try {
    const jobs = await collector.collect();
    console.log(`Successfully extracted ${jobs.length} jobs.`);
    if (jobs.length > 0) {
      console.log('Sample extracted data:', JSON.stringify(jobs[0], null, 2));
    } else {
      console.log('No jobs found. This might be because the generic parser needs to be adjusted for these specific sites.');
    }
  } catch (error) {
    console.error('Crawler failed:', error);
  }
};

testCareerPage();
