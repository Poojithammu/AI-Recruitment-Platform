const dashboardService = require('../services/recruiters/dashboardService');

exports.getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('DASHBOARD_STATS_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHiringTrends = async (req, res) => {
  try {
    const trends = await dashboardService.getHiringTrends();
    res.json(trends);
  } catch (error) {
    console.error('DASHBOARD_TRENDS_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTechDemand = async (req, res) => {
  try {
    const demand = await dashboardService.getTechDemand();
    console.log('DEBUG: Tech Demand Data being sent:', demand.length, 'items');
    res.json(demand);
  } catch (error) {
    console.error('DASHBOARD_TECH_DEMAND_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentJobs = async (req, res) => {
  try {
    const jobs = await dashboardService.getRecentJobs();
    res.json(jobs);
  } catch (error) {
    console.error('DASHBOARD_JOBS_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await dashboardService.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('DASHBOARD_ALERTS_ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
