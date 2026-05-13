const HiringJob = require('../../models/HiringJob');

class HiringService {
  async getJobs(query) {
    const {
      source,
      company,
      skills,
      location,
      experience,
      remote,
      employmentType,
      isActive,
      page = 1,
      limit = 10
    } = query;

    const filter = {};
    if (source) filter.source = source;
    if (company) filter.companyName = new RegExp(company, 'i');
    if (skills) filter.requiredSkills = { $in: skills.split(',') };
    if (location) filter['hiringLocation.city'] = new RegExp(location, 'i');
    if (experience) filter['experienceRequired.min'] = { $gte: parseInt(experience) };
    if (remote !== undefined) filter['hiringLocation.remote'] = remote === 'true';
    if (employmentType) filter.employmentType = employmentType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const jobs = await HiringJob.find(filter)
      .sort({ postedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HiringJob.countDocuments(filter);

    return {
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async createJob(jobData) {
    // Generate a simple hash if not provided for manual entries
    if (!jobData.hash) {
      jobData.hash = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!jobData.source) jobData.source = 'manual';
    if (!jobData.sourceJobId) jobData.sourceJobId = `MAN-${Date.now()}`;
    if (!jobData.sourceUrl) jobData.sourceUrl = '#';

    return await HiringJob.create(jobData);
  }

  async getJobById(id) {
    return await HiringJob.findById(id);
  }

  async deleteJob(id) {
    return await HiringJob.findByIdAndDelete(id);
  }

  async getStats() {
    const totalJobs = await HiringJob.countDocuments();
    
    const sourceDistribution = await HiringJob.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    const remoteJobsCount = await HiringJob.countDocuments({ 'hiringLocation.remote': true });
    
    const recentJobsCount = await HiringJob.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const topSkills = await HiringJob.aggregate([
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topCompanies = await HiringJob.aggregate([
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      totalJobs,
      sourceDistribution,
      remoteJobsCount,
      recentJobsCount,
      topSkills,
      topCompanies
    };
  }
}

module.exports = new HiringService();
