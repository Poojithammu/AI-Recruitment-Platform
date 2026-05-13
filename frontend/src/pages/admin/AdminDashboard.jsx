import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Users, Building2, Briefcase, BarChart3, RefreshCcw, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import api from '../../api';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    jobsBySource: [],
    userDistribution: [],
    jobTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">System Oversight</h1>
          <p className="text-muted-foreground mt-2">Global platform analytics and data-driven insights.</p>
        </div>
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all disabled:opacity-50 border border-border"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Platform Users" value={stats.totalUsers} icon={Users} color="primary" />
        <StatCard title="Verified Recruiters" value={stats.activeRecruiters} icon={Building2} color="secondary" />
        <StatCard title="Total Job Inventory" value={stats.totalJobs} icon={Briefcase} color="success" />
        <StatCard title="Live Opportunities" value={stats.activeJobs} icon={BarChart3} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Inventory Growth</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">New listings discovered (Last 7 Days)</p>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.jobTrends}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', fontSize: '12px'}}
                    itemStyle={{color: '#6366f1'}}
                  />
                  <Area type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* User Distribution */}
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                 <PieIcon size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">User Ecosystem</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Distribution by Role</p>
              </div>
           </div>

           <div className="flex-1 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', fontSize: '12px'}}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(val) => <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Jobs by Source */}
         <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Data Sources</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Acquisition Breakdown</p>
                </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.jobsBySource} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', fontSize: '12px'}}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats.jobsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Quick Actions / Tips */}
         <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-[32px] p-8 flex items-center justify-between overflow-hidden relative">
            <div className="max-w-[60%] relative z-10">
               <h2 className="text-2xl font-black mb-4">Ready to expand?</h2>
               <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  The hiring intelligence engine has discovered 12 new sources today. Review the scraper health to ensure maximum data velocity.
               </p>
               <button className="px-8 py-3 bg-primary text-white font-black rounded-2xl text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                  Launch Optimizer
               </button>
            </div>
            <div className="absolute -right-10 top-0 bottom-0 flex items-center opacity-10">
               <TrendingUp size={240} className="text-primary" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
