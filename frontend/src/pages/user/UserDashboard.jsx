import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Briefcase, Brain, Building2, Star, TrendingUp, BarChart3, RefreshCcw } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import api from '../../api';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    jobsByDomain: [],
    jobTrends: [],
    topSkills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Career Intelligence</h1>
          <p className="text-muted-foreground mt-2 font-medium">Data-driven overview of the current technical job market.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-3 bg-card border border-border rounded-2xl hover:bg-muted transition-all"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Open Roles" value={stats.totalJobs} icon={Briefcase} color="primary" />
        <StatCard title="Target Companies" value={stats.totalCompanies} icon={Building2} color="success" />
        <StatCard title="Tech Demand" value="High" icon={TrendingUp} color="secondary" />
        <StatCard title="Profile Strength" value="85%" icon={Star} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Discovery Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[32px] p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Discovery Velocity</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">New opportunities discovered daily</p>
              </div>
           </div>
           
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.jobTrends}>
                  <defs>
                    <linearGradient id="colorUserJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="date" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px'}}
                  />
                  <Area type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUserJobs)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Top Domains */}
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                 <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Market Domains</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Top hiring sectors</p>
              </div>
           </div>

           <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.jobsByDomain} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px'}} />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {stats.jobsByDomain.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Skills Radar / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                  <Brain size={20} />
               </div>
               <div>
                  <h3 className="font-black text-lg">Hot Skills</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Most requested technologies</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               {stats.topSkills.map((skill, index) => (
                 <div key={index} className="px-6 py-3 bg-muted/50 border border-border rounded-2xl text-sm font-black transition-all hover:border-primary/50 hover:text-primary">
                    {skill}
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-gradient-to-br from-primary to-secondary rounded-[32px] p-1 shadow-xl shadow-primary/10">
            <div className="bg-card h-full rounded-[30px] p-8 flex flex-col justify-center">
               <h3 className="text-2xl font-black mb-2">Resume Optimization</h3>
               <p className="text-muted-foreground font-medium mb-6">
                  Our AI suggests that adding <span className="text-primary font-bold">"System Design"</span> could increase your match rate by 24%.
               </p>
               <button className="w-fit px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  Run Full Scan
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserDashboard;
