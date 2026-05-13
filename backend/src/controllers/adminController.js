const User = require('../models/User');
const HiringJob = require('../models/HiringJob');
const Company = require('../models/Company');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getAllJobs = async (req, res) => {
  try {
    const { source, companyName, jobRole, isActive, search } = req.query;
    let query = {};

    if (source) query.source = source;
    if (companyName) query.companyName = { $regex: companyName, $options: 'i' };
    if (jobRole) query.jobRole = { $regex: jobRole, $options: 'i' };
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await HiringJob.find(query).sort('-createdAt').limit(100);
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
  try {
    const job = await HiringJob.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await HiringJob.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRecruiters = await User.countDocuments({ role: 'recruiter', isActive: true });
    const totalJobs = await HiringJob.countDocuments();
    const activeJobs = await HiringJob.countDocuments({ isActive: true });

    // Jobs by Source
    const jobsBySource = await HiringJob.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // User Distribution by Role
    const userDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // Job Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const jobTrends = await HiringJob.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', jobs: '$count', _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeRecruiters,
        totalJobs,
        activeJobs,
        jobsBySource,
        userDistribution,
        jobTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
