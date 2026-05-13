const LeadScore = require('../../models/LeadScore');
const Company = require('../../models/Company');
const Job = require('../../models/Job');
const Recruiter = require('../../models/Recruiter');
const Trend = require('../../models/Trend');

class LeadScoringService {
  async calculateLeadScore(companyId) {
    try {
      const company = await Company.findById(companyId);
      if (!company) throw new Error('Company not found');

      const jobs = await Job.find({ companyId });
      const recruiters = await Recruiter.find({ companyId });
      const trends = await Trend.find({ companyId });

      let score = 0;
      let breakdown = {};

      // Active Job Openings -> 25% (Max 25 pts if > 5 jobs)
      const jobScore = Math.min(25, jobs.length * 5);
      score += jobScore;
      breakdown.activeJobs = jobScore;

      // HR Contacts Available -> 15% (Max 15 pts if > 2 contacts)
      const hrScore = Math.min(15, recruiters.length * 7.5);
      score += hrScore;
      breakdown.hrContacts = hrScore;

      // Hiring Frequency -> 20% (Based on trends)
      const hasAggressiveHiring = trends.some(t => t.trendType === 'Aggressive Hiring');
      const frequencyScore = hasAggressiveHiring ? 20 : 5;
      score += frequencyScore;
      breakdown.hiringFrequency = frequencyScore;

      // Other weights (Tech Match 20%, Size 10%, News 10%) mocked for now
      score += 30; // Mocked base score for others
      breakdown.otherFactors = 30;

      const leadScoreRecord = await LeadScore.findOneAndUpdate(
        { companyId },
        { score, breakdown },
        { returnDocument: 'after', upsert: true }
      );

      // Update Company document
      company.hiringScore = score;
      await company.save();

      return leadScoreRecord;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      throw new Error('Failed to calculate lead score');
    }
  }
}

module.exports = new LeadScoringService();
