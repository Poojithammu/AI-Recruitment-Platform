import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, Building2, Users, CheckCircle, Send, Star,
  Brain, Clock, Bell, ArrowUpRight, ArrowDownRight, TrendingUp,
  Activity, Plus, AlertTriangle, Sparkles, Zap, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';
import api from '../../api';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Briefcase': return Briefcase;
    case 'Building': return Building2;
    case 'Users': return Users;
    case 'Star': return Star;
    case 'CheckCircle': return CheckCircle;
    case 'Send': return Send;
    case 'Clock': return Clock;
    default: return Bell;
  }
};

const KPICard = ({ label, value, trend, icon: Icon, loading, gradient, index }) => {
  const isPositive = trend?.startsWith('+');

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-muted rounded-xl" />
          <div className="w-16 h-5 bg-muted rounded-lg" />
        </div>
        <div className="w-20 h-3 bg-muted rounded mb-2" />
        <div className="w-28 h-7 bg-muted rounded" />
      </div>
    );
  }

  const gradients = [
    'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    'from-violet-500/10 to-purple-500/10 border-violet-500/20',
    'from-green-500/10 to-emerald-500/10 border-green-500/20',
    'from-orange-500/10 to-amber-500/10 border-orange-500/20',
  ];

  const iconColors = ['text-blue-400', 'text-violet-400', 'text-green-400', 'text-orange-400'];
  const iconBgs = ['bg-blue-500/10', 'bg-violet-500/10', 'bg-green-500/10', 'bg-orange-500/10'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border bg-gradient-to-br p-6 ${gradients[index % 4]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBgs[index % 4]} flex items-center justify-center`}>
          <Icon size={20} className={iconColors[index % 4]} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [hiringTrends, setHiringTrends] = useState([]);
  const [techDemand, setTechDemand] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, trendsRes, techRes, jobsRes, alertsRes] = await Promise.all([
          api.get('/recruiter/dashboard/stats'),
          api.get('/recruiter/dashboard/hiring-trends'),
          api.get('/recruiter/dashboard/tech-demand'),
          api.get('/recruiter/dashboard/recent-jobs'),
          api.get('/recruiter/dashboard/alerts'),
        ]);
        setStats(statsRes.data);
        setHiringTrends(trendsRes.data);
        setTechDemand(techRes.data);
        setRecentJobs(jobsRes.data);
        setAlerts(alertsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="text-red-400" size={28} />
        </div>
        <h2 className="text-xl font-bold">{error}</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">AI-Powered</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's what's happening with your hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Activity}>Generate Report</Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/recruiter/jobs/new')}>
            Post New Job
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-muted-foreground uppercase tracking-wider text-xs">Key Metrics</h2>
          {!loading && stats.length > 0 && (
            <ExportDropdown
              data={stats.map(s => ({ Label: s.label, Value: s.value, Trend: s.trend }))}
              fileName="recruiter_kpis"
              title="Key Performance Indicators"
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [1, 2, 3, 4].map(i => <KPICard key={i} loading={true} />)
            : stats.map((stat, i) => (
                <KPICard
                  key={i}
                  index={i}
                  label={stat.label}
                  value={stat.value}
                  trend={stat.trend}
                  icon={getIcon(stat.icon)}
                />
              ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Trends Area Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Hiring Trends</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Application & hire volume over time</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Last 7 Days</Badge>
              {!loading && hiringTrends.length > 0 && (
                <ExportDropdown
                  data={hiringTrends.map(t => ({ Date: t.name, Hires: t.value }))}
                  fileName="hiring_trends"
                  title="Hiring Trends Report"
                />
              )}
            </div>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hiringTrends}>
                  <defs>
                    <linearGradient id="hiringGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#hiringGradient)" dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Technology Demand */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Tech Demand</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Top required skills</p>
            </div>
            <div className="flex items-center gap-2">
              {!loading && techDemand.length > 0 && (
                <ExportDropdown
                  data={techDemand.map(t => ({ Technology: t.name, Hits: t.value }))}
                  fileName="tech_demand"
                  title="Technology Demand Analytics"
                />
              )}
            </div>
          </div>
          <div className="space-y-5">
            {loading
              ? [1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                      <div className="w-10 h-3 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full animate-pulse" />
                  </div>
                ))
              : techDemand.map((tech, i) => (
                  <div key={tech.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{tech.name}</span>
                      <span className="text-muted-foreground text-xs">{tech.value} jobs</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(tech.value / (techDemand[0]?.value || 1)) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: tech.color || '#3b82f6' }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row: Recent Jobs + AI Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Recent Hiring Jobs</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest posted positions</p>
            </div>
            <div className="flex items-center gap-2">
              {!loading && recentJobs.length > 0 && (
                <ExportDropdown
                  data={recentJobs.map(j => ({
                    Role: j.jobRole || j.role,
                    Company: j.companyId?.companyName || j.companyName || 'Unknown',
                    Status: j.isActive ? 'Active' : 'Closed',
                    Date: new Date(j.createdAt).toLocaleDateString(),
                  }))}
                  fileName="recent_jobs"
                  title="Recent Hiring Jobs List"
                />
              )}
              <button onClick={() => navigate('/recruiter/jobs')} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                View All <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {loading
              ? [1, 2, 3, 4].map(i => (
                  <div key={i} className="p-5 flex justify-between animate-pulse">
                    <div className="space-y-2">
                      <div className="w-36 h-4 bg-muted rounded" />
                      <div className="w-24 h-3 bg-muted rounded" />
                    </div>
                    <div className="w-16 h-6 bg-muted rounded-full" />
                  </div>
                ))
              : recentJobs.length === 0
              ? (
                <div className="py-12 text-center text-muted-foreground text-sm">No recent jobs found.</div>
              )
              : recentJobs.map((job) => (
                  <div key={job._id} onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                    className="group p-5 flex items-center justify-between hover:bg-primary/5 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{job.jobRole || job.role}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 size={11} className="text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{job.companyId?.companyName || job.companyName || 'Unknown'}</p>
                        <span className="text-muted-foreground/30">•</span>
                        <p className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.isActive ? 'success' : 'secondary'} className="rounded-full">
                        {job.isActive ? 'Active' : 'Closed'}
                      </Badge>
                      <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
          </div>
        </Card>

        {/* AI Alerts */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">AI Alerts & Insights</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time hiring intelligence</p>
            </div>
            <div className="flex items-center gap-2">
              {!loading && alerts && (
                <ExportDropdown
                  data={[
                    alerts?.highPriorityCandidate && { Type: 'High Match Candidate', Detail: `${alerts.highPriorityCandidate.fullName} (${alerts.highPriorityCandidate.matchScore}%)` },
                    alerts?.trendAlert && { Type: 'Market Trend', Detail: `${alerts.trendAlert.trendType}: ${alerts.trendAlert.analysis}` },
                    { Type: 'Reminders', Detail: `${alerts?.followUpReminder?.count || 0} Pending Follow-ups` },
                  ].filter(Boolean)}
                  fileName="ai_alerts"
                  title="AI Hiring Alerts & Insights"
                />
              )}
              <Badge variant="danger" className="animate-pulse">● Live</Badge>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-xl" />)
            ) : (
              <>
                {alerts?.highPriorityCandidate && (
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">High Match</p>
                      <p className="text-sm font-semibold">{alerts.highPriorityCandidate.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alerts.highPriorityCandidate.matchScore}% compatibility score</p>
                      <Button variant="primary" size="sm" className="mt-3 h-7 text-xs">View Profile</Button>
                    </div>
                  </motion.div>
                )}

                {alerts?.trendAlert && (
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={18} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-0.5">Market Trend</p>
                      <p className="text-sm font-semibold">{alerts.trendAlert.trendType}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alerts.trendAlert.analysis}</p>
                    </div>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl bg-muted/30 border border-border flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Send size={18} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Follow-ups</p>
                    <p className="text-sm font-semibold">
                      {alerts?.followUpReminder?.count || 0} pending follow-up{alerts?.followUpReminder?.count !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Review your outreach queue</p>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
