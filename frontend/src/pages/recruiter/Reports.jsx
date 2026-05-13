import React, { useState } from 'react';
import { 
  BarChart3, FileText, Download, ChevronRight, Calendar, 
  TrendingUp, PieChart as PieChartIcon, ArrowUpRight, 
  Filter, Plus, Sparkles, Clock, CheckCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { motion } from 'framer-motion';

const weeklyData = [
  { name: 'Week 1', apps: 120, hires: 5 },
  { name: 'Week 2', apps: 250, hires: 12 },
  { name: 'Week 3', apps: 180, hires: 8 },
  { name: 'Week 4', apps: 320, hires: 18 },
];

const pieData = [
  { name: 'Engineering', value: 45, color: '#3b82f6' },
  { name: 'Design', value: 20, color: '#8b5cf6' },
  { name: 'Marketing', value: 15, color: '#10b981' },
  { name: 'Product', value: 20, color: '#f59e0b' },
];

const timeToHire = [
  { name: 'Jan', days: 28 },
  { name: 'Feb', days: 24 },
  { name: 'Mar', days: 20 },
  { name: 'Apr', days: 18 },
  { name: 'May', days: 15 },
];

const kpis = [
  { label: 'Total Applications', value: '1,870', delta: '+18%', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { label: 'Total Hires', value: '43', delta: '+12%', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { label: 'Avg. Time-to-Hire', value: '17d', delta: '-3d', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { label: 'Offer Acceptance', value: '84%', delta: '+6%', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

const scheduledReports = [
  { name: 'Monthly Hiring Summary', type: 'Performance', date: 'Next run: June 1st', status: 'Active', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Quarterly Market Trends', type: 'Intelligence', date: 'Next run: July 1st', status: 'Active', color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'Recruiter Productivity Daily', type: 'Operations', date: 'Next run: Tomorrow 9AM', status: 'Paused', color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const ReportsAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('30d');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={20} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Deep dive into your hiring performance and market trends.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex bg-muted rounded-xl border border-border p-1">
            {['7d', '30d', '90d'].map(p => (
              <button key={p} onClick={() => setTimePeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timePeriod === p ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <Button variant="primary" icon={Plus}>Custom Report</Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border p-5 ${kpi.bg} ${kpi.border}`}>
            <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</h3>
              <span className="text-xs text-green-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight size={12} />{kpi.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Performance Bar Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Hiring Performance
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Applications vs Hires per week</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"/> Applications</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"/> Hires</span>
              </div>
              <ExportDropdown data={weeklyData} fileName="hiring_performance" title="Weekly Hiring Performance" />
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                <Bar dataKey="apps" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="hires" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <PieChartIcon size={18} className="text-primary" />
              By Department
            </h3>
            <Badge variant="secondary">Global</Badge>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-52 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Time-to-Hire Trend */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg">Time-to-Hire Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Average days to close a position</p>
          </div>
          <ExportDropdown data={timeToHire.map(d => ({ Month: d.name, Days: d.days }))} fileName="time_to_hire" title="Time-to-Hire Trend" />
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeToHire}>
              <defs>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} domain={[10, 35]} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '10px' }} />
              <Area type="monotone" dataKey="days" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#timeGradient)" dot={{ fill: '#8b5cf6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Scheduled Reports</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Automated reports running on schedule</p>
          </div>
          <Button variant="outline" icon={Plus} size="sm">Add Report</Button>
        </div>
        <div>
          {scheduledReports.map((report, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center flex-shrink-0`}>
                  <FileText size={18} className={report.color} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{report.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${report.color}`}>{report.type}</span>
                    <span className="text-muted-foreground text-[10px]">•</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock size={10} />{report.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={report.status === 'Active' ? 'success' : 'muted'}>{report.status}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Download size={15} />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
