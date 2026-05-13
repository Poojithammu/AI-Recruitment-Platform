const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Load models
const Company = require('../models/Company');
const HiringJob = require('../models/HiringJob');
const LeadScore = require('../models/LeadScore');
const Trend = require('../models/Trend');
const Recruiter = require('../models/Recruiter');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const generateHash = (data) => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

const seedData = async () => {
  try {
    // Clear existing data (except users)
    await Company.deleteMany();
    await HiringJob.deleteMany();
    await LeadScore.deleteMany();
    await Trend.deleteMany();
    await Recruiter.deleteMany();

    console.log('Existing data cleared...');

    // 1. Create Companies
    const companies = await Company.insertMany([
      {
        companyName: 'TechNova Solutions',
        website: 'https://technova.io',
        industry: 'Software Development',
        companySize: '501-1000',
        hiringScore: 85,
        trend: 'Upward',
        description: 'Leading AI-driven software solutions provider specializing in fintech.'
      },
      {
        companyName: 'GreenEnergy Corp',
        website: 'https://greenenergy.com',
        industry: 'Renewable Energy',
        companySize: '1001-5000',
        hiringScore: 72,
        trend: 'Stable',
        description: 'Global leader in sustainable energy and electric vehicle infrastructure.'
      },
      {
        companyName: 'CloudStream Systems',
        website: 'https://cloudstream.net',
        industry: 'Cloud Computing',
        companySize: '201-500',
        hiringScore: 91,
        trend: 'Rapid Growth',
        description: 'Cloud infrastructure and serverless optimization startup.'
      }
    ]);

    console.log('Companies seeded...');

    // 2. Create Hiring Jobs
    const jobsData = [
      {
        source: 'career_page',
        sourceJobId: 'TN-992',
        sourceUrl: 'https://technova.io/careers/senior-backend-engineer',
        companyName: 'TechNova Solutions',
        jobRole: 'Senior Backend Engineer',
        requiredSkills: ['Node.js', 'MongoDB', 'Redis', 'AWS'],
        experienceRequired: { min: 5, max: 8, raw: '5-8 years' },
        hiringLocation: { city: 'Bangalore', state: 'Karnataka', country: 'India', remote: true },
        jobDescription: 'We are looking for a Senior Backend Engineer to join our core AI platform team...',
        salary: { min: 2500000, max: 4000000, currency: 'INR' },
        employmentType: 'full-time',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        source: 'linkedin',
        sourceJobId: 'LI-88273',
        sourceUrl: 'https://linkedin.com/jobs/view/88273',
        companyName: 'GreenEnergy Corp',
        jobRole: 'Project Manager - Solar',
        requiredSkills: ['Project Management', 'Solar Energy', 'Agile'],
        experienceRequired: { min: 7, max: 12, raw: '7+ years' },
        hiringLocation: { city: 'Hyderabad', state: 'Telangana', country: 'India', remote: false },
        jobDescription: 'Seeking an experienced Project Manager to oversee solar plant installations...',
        salary: { min: 1800000, max: 3000000, currency: 'INR' },
        employmentType: 'full-time',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        source: 'startup_platform',
        sourceJobId: 'SP-101',
        sourceUrl: 'https://wellfound.com/jobs/101',
        companyName: 'CloudStream Systems',
        jobRole: 'Full Stack Developer',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        experienceRequired: { min: 2, max: 5, raw: '2-5 years' },
        hiringLocation: { city: 'Pune', state: 'Maharashtra', country: 'India', remote: true },
        jobDescription: 'Join our early-stage startup to build the next generation of cloud tools...',
        salary: { min: 1200000, max: 2200000, currency: 'INR' },
        employmentType: 'full-time',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    const hiringJobs = await HiringJob.insertMany(jobsData.map(j => ({
      ...j,
      hash: generateHash(j)
    })));

    console.log('Hiring jobs seeded...');

    // 3. Create Lead Scores
    await LeadScore.insertMany([
      {
        companyId: companies[0]._id,
        score: 88,
        breakdown: { recentHiring: 30, fundingStatus: 25, techStackMatch: 20, employeeGrowth: 13 }
      },
      {
        companyId: companies[1]._id,
        score: 65,
        breakdown: { recentHiring: 15, fundingStatus: 20, techStackMatch: 15, employeeGrowth: 15 }
      },
      {
        companyId: companies[2]._id,
        score: 94,
        breakdown: { recentHiring: 40, fundingStatus: 30, techStackMatch: 15, employeeGrowth: 9 }
      }
    ]);

    console.log('Lead scores seeded...');

    // 4. Create Trends
    await Trend.insertMany([
      {
        companyId: companies[0]._id,
        trendType: 'Hiring Spree',
        score: 90,
        analysis: 'Significant increase in backend and AI engineering roles over the last 30 days.'
      },
      {
        companyId: companies[2]._id,
        trendType: 'Expansion',
        score: 95,
        analysis: 'Expanding into new regions; high demand for sales and customer success roles.'
      }
    ]);

    console.log('Trends seeded...');

    // 5. Create Recruiters
    await Recruiter.insertMany([
      {
        companyId: companies[0]._id,
        name: 'Sarah Johnson',
        designation: 'Head of Talent Acquisition',
        email: 'sarah.j@technova.io',
        linkedin: 'https://linkedin.com/in/sarahj-recruiter',
        source: 'LinkedIn'
      },
      {
        companyId: companies[2]._id,
        name: 'Amit Sharma',
        designation: 'Tech Recruiter',
        email: 'amit.s@cloudstream.net',
        linkedin: 'https://linkedin.com/in/amit-sharma-hr',
        source: 'Manual'
      }
    ]);

    console.log('Recruiters seeded...');
    console.log('Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

connectDB().then(seedData);
