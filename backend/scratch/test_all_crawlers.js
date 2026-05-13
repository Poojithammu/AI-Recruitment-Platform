const LinkedInCollector = require('../src/collectors/LinkedInCollector');
const InstahyreCollector = require('../src/collectors/InstahyreCollector');
const StartupPlatformCollector = require('../src/collectors/StartupPlatformCollector');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testAll = async () => {
  const collectors = [
    new LinkedInCollector(),
    new InstahyreCollector(),
    new IndeedCollector(),
    new StartupPlatformCollector()
  ];

  for (const collector of collectors) {
    console.log(`\n--- Testing ${collector.sourceName} ---`);
    try {
      const jobs = await collector.collect();
      console.log(`Successfully extracted ${jobs.length} jobs.`);
      if (jobs.length > 0) {
        console.log('Sample:', JSON.stringify(jobs[0], null, 2));
      }
    } catch (error) {
      console.error(`${collector.sourceName} failed:`, error.message);
    }
  }
};

testAll();
