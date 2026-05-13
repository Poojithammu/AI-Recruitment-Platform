import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

const IntelligenceHub = () => {
  const hiringTrendData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 600 },
    { name: 'Mar', value: 800 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 1800 },
    { name: 'Jun', value: 2400 },
  ];

  const techDemandData = [
    { name: 'React', value: 85 },
    { name: 'Node.js', value: 72 },
    { name: 'Python', value: 94 },
    { name: 'AWS', value: 68 },
    { name: 'Docker', value: 55 },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Intelligence Hub</h1>
        <p className="text-muted-foreground mt-2">Strategic hiring insights and competitor analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Market Demand" value="+24%" icon={TrendingUp} color="primary" />
        <StatCard title="Top Competitor" value="Meta" icon={Target} color="danger" />
        <StatCard title="Talent Pool" value="12k+" icon={Users} color="secondary" />
        <StatCard title="AI Accuracy" value="98%" icon={Zap} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">General Hiring Trends</h3>
          <div className="flex-1">
            <AnalyticsChart type="area" data={hiringTrendData} dataKey="value" color="#3b82f6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Top Technology Demands</h3>
          <div className="flex-1">
            <AnalyticsChart type="bar" data={techDemandData} dataKey="value" color="#8b5cf6" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Competitor Snapshot</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['Google', 'Microsoft', 'Amazon'].map(company => (
            <div key={company} className="p-6 bg-muted/30 rounded-2xl border border-border flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
              <div>
                <p className="font-bold text-lg">{company}</p>
                <p className="text-xs text-muted-foreground">45 active openings</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
