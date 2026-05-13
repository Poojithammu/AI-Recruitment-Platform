import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "from-blue-600/20 to-blue-600/5 text-blue-500 border-blue-500/20",
    secondary: "from-purple-600/20 to-purple-600/5 text-purple-500 border-purple-500/20",
    success: "from-green-600/20 to-green-600/5 text-green-500 border-green-500/20",
    warning: "from-yellow-600/20 to-yellow-600/5 text-yellow-500 border-yellow-500/20",
    danger: "from-red-600/20 to-red-600/5 text-red-500 border-red-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          
          {trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trendValue}%</span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-background/50 border border-white/5 shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative Background Element */}
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon size={100} strokeWidth={1} />
      </div>
    </motion.div>
  );
};

export default StatCard;
