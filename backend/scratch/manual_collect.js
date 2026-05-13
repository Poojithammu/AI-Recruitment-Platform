const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const crawlerOrchestrator = require('../src/services/hiring/CrawlerOrchestrator');
const mongoose = require('mongoose');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Running crawler...');
    const summary = await crawlerOrchestrator.runAll();
    console.log('Collection Summary:', summary);
    
    const HiringJob = require('../src/models/HiringJob');
    const samples = await HiringJob.find().limit(2);
    console.log('Sample Data:', JSON.stringify(samples, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

run();
