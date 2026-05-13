const HiringJob = require('../../models/HiringJob');
const Company = require('../../models/Company');
const CandidateProfile = require('../../models/CandidateProfile');
const OutreachLog = require('../../models/OutreachLog');
const LeadScore = require('../../models/LeadScore');
const Notification = require('../../models/Notification');
const RequirementExtraction = require('../../models/RequirementExtraction');
const Trend = require('../../models/Trend');

class DashboardService {
  async getStats() {
    try {
      const activeJobs = await HiringJob.countDocuments({ isActive: true });
      const companies = await Company.countDocuments();
      const matchedCandidates = await CandidateProfile.countDocuments({ isActivelyLooking: true });
      const outreachSent = await OutreachLog.countDocuments({ status: 'sent' });
      const highPriorityLeads = await LeadScore.countDocuments({ score: { $gte: 80 } });
      const pendingFollowUps = await OutreachLog.countDocuments({ followUpStatus: 'pending' });
      const unreadNotifications = await Notification.countDocuments({ read: false });

      return [
        {
          label: "Active Jobs",
          value: activeJobs,
          trend: "+12%",
          icon: "Briefcase"
        },
        {
          label: "Companies",
          value: companies,
          trend: "+6%",
          icon: "Building"
        },
        {
          label: "Candidates",
          value: matchedCandidates,
          trend: "+9%",
          icon: "Users"
        },
        {
          label: "Priority Leads",
          value: highPriorityLeads,
          trend: "+15%",
          icon: "Star"
        }
      ];
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }

  async getHiringTrends() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trends = await HiringJob.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo, $ne: null, $type: "date" }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            value: { $sum: 1 },
            date: { $first: "$createdAt" }
          }
        },
        {
          $sort: { date: 1 }
        },
        {
          $project: {
            name: "$_id",
            value: 1,
            _id: 0
          }
        }
      ]);

      return trends || [];
    } catch (error) {
      console.error('Error in getHiringTrends aggregation:', error);
      // Return empty trends instead of throwing to keep dashboard functional
      return [];
    }
  }

  async getTechDemand() {
    try {
      const techDemand = await RequirementExtraction.aggregate([
        { $unwind: "$extractedData.skills" },
        {
          $group: {
            _id: "$extractedData.skills",
            value: { $sum: 1 }
          }
        },
        { $sort: { value: -1 } },
        { $limit: 5 },
        {
          $project: {
            name: "$_id",
            value: 1,
            _id: 0
          }
        }
      ]);

      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
      return techDemand.map((item, index) => ({
        ...item,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Error in getTechDemand:', error);
      throw error;
    }
  }

  async getRecentJobs() {
    try {
      return await HiringJob.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('companyId', 'companyName');
    } catch (error) {
      console.error('Error in getRecentJobs:', error);
      throw error;
    }
  }

  async getAlerts() {
    try {
      const highPriorityCandidate = await CandidateProfile.findOne()
        .sort({ matchScore: -1 });

      const trendAlert = await Trend.findOne()
        .sort({ createdAt: -1 });

      const followUpCount = await OutreachLog.countDocuments({ followUpStatus: 'pending' });

      return {
        highPriorityCandidate,
        trendAlert,
        followUpReminder: {
          count: followUpCount
        }
      };
    } catch (error) {
      console.error('Error in getAlerts:', error);
      throw error;
    }
  }
}

module.exports = new DashboardService();
