const Trend = require('../../models/Trend');
const Job = require('../../models/Job');

class TrendAnalysisService {
  async analyzeHiringTrends() {
    try {
      // Very simplified trend analysis logic
      // In production, this would use AI (Gemini) over aggregated job data
      const jobs = await Job.find().populate('companyId');
      
      const companyJobCounts = {};
      
      jobs.forEach(job => {
        if (job.companyId) {
           const id = job.companyId._id.toString();
           if (!companyJobCounts[id]) {
             companyJobCounts[id] = { count: 0, companyId: id };
           }
           companyJobCounts[id].count += 1;
        }
      });
      
      const newTrends = [];

      for (const [id, data] of Object.entries(companyJobCounts)) {
        if (data.count > 5) {
          const trend = await Trend.create({
            companyId: data.companyId,
            trendType: 'Aggressive Hiring',
            score: Math.min(100, data.count * 10),
            analysis: `Company has ${data.count} active job openings indicating aggressive expansion.`
          });
          newTrends.push(trend);
        }
      }
      
      return newTrends;
    } catch (error) {
      console.error('Error analyzing trends:', error);
      throw new Error('Failed to analyze hiring trends');
    }
  }
}

module.exports = new TrendAnalysisService();
