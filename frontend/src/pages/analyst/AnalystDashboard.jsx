import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Database, BarChart3, TrendingUp, PieChart } from 'lucide-react';

const AnalystDashboard = () => {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Data Analytics</h1>
        <p className="text-muted-foreground mt-2">In-depth market trends and source-wise performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Data Points" value="1.2M" icon={Database} trend="up" trendValue={15} color="primary" />
        <StatCard title="Trend Confidence" value="94%" icon={TrendingUp} color="success" />
        <StatCard title="Extraction Stats" value="5.2k" icon={PieChart} color="secondary" />
        <StatCard title="Source Performance" value="8.4/10" icon={BarChart3} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-3xl p-8 min-h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground font-medium italic">Technology Demand Heatmap (Placeholder)</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8 min-h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground font-medium italic">Company Hiring Growth (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
