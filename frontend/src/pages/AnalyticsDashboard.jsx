import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, Target, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const hiringData = [
  { name: 'Jan', tech: 4000, nonTech: 2400 },
  { name: 'Feb', tech: 3000, nonTech: 1398 },
  { name: 'Mar', tech: 2000, nonTech: 9800 },
  { name: 'Apr', tech: 2780, nonTech: 3908 },
  { name: 'May', tech: 1890, nonTech: 4800 },
  { name: 'Jun', tech: 2390, nonTech: 3800 },
  { name: 'Jul', tech: 3490, nonTech: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-gray-600 transition-colors"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} bg-opacity-20 backdrop-blur-md`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    
    <div className="flex items-center text-sm">
      <span className="text-success flex items-center font-medium bg-success/10 px-2 py-0.5 rounded-md">
        <TrendingUp size={14} className="mr-1" /> {change}
      </span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Hiring Intelligence</h1>
          <p className="text-text-muted">Real-time recruitment analytics and AI-driven insights.</p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Activity size={18} />
          Trigger AI Analysis
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Openings" 
          value="1,245" 
          change="+12.5%" 
          icon={Briefcase} 
          colorClass="from-blue-500 to-primary"
          delay={0.1}
        />
        <StatCard 
          title="Companies Tracking" 
          value="482" 
          change="+4.2%" 
          icon={Users} 
          colorClass="from-purple-500 to-secondary"
          delay={0.2}
        />
        <StatCard 
          title="Avg Lead Score" 
          value="84.5" 
          change="+2.1%" 
          icon={Target} 
          colorClass="from-emerald-500 to-success"
          delay={0.3}
        />
        <StatCard 
          title="Aggressive Hiring" 
          value="24" 
          change="+8.4%" 
          icon={TrendingUp} 
          colorClass="from-orange-500 to-warning"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Market Hiring Velocity</h3>
            <select className="bg-background border border-gray-700 text-sm rounded-lg px-3 py-1.5 text-white outline-none focus:border-primary">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringData}>
                <defs>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNonTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tech" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTech)" />
                <Area type="monotone" dataKey="nonTech" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorNonTech)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Top Hot Technologies</h3>
          
          <div className="space-y-5">
            {[
              { skill: 'React.js', percent: 85, color: 'bg-blue-500' },
              { skill: 'Python', percent: 72, color: 'bg-yellow-500' },
              { skill: 'Node.js', percent: 68, color: 'bg-green-500' },
              { skill: 'AWS', percent: 60, color: 'bg-orange-500' },
              { skill: 'Docker', percent: 45, color: 'bg-cyan-500' },
            ].map((item, index) => (
              <div key={item.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 font-medium">{item.skill}</span>
                  <span className="text-text-muted">{item.percent}% demand</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                    className={`${item.color} h-2 rounded-full`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
