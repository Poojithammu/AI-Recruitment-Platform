import React from 'react';
import { 
  Target, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Search,
  MoreVertical,
  Activity,
  Zap,
  BarChart3,
  Cpu
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { leadScores } from '../../services/mockData';

const radarData = [
  { subject: 'Tech Match', A: 120, fullMark: 150 },
  { subject: 'Hiring Frequency', A: 98, fullMark: 150 },
  { subject: 'Company Size', A: 86, fullMark: 150 },
  { subject: 'Funding', A: 99, fullMark: 150 },
  { subject: 'Active Jobs', A: 85, fullMark: 150 },
  { subject: 'Growth Rate', A: 65, fullMark: 150 },
];

const scoringHistory = [
  { date: 'May 1', score: 85 },
  { date: 'May 3', score: 88 },
  { date: 'May 5', score: 82 },
  { date: 'May 7', score: 91 },
  { date: 'May 9', score: 94 },
  { date: 'May 11', score: 98 },
];

const LeadScoring = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Scoring</h1>
          <p className="text-muted-foreground mt-1">AI-ranked leads based on hiring signals and technical relevance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={BarChart3}>Analysis Report</Button>
          <Button variant="primary" icon={Zap}>Recalculate All</Button>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Cpu size={20} className="text-primary" />
              Scoring Parameters Breakdown
            </h3>
            <Badge variant="secondary">Global Average</Badge>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Lead Score"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Scoring Trend
            </h3>
          </div>
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoringHistory}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50 border border-border">
              <span className="text-sm text-muted-foreground">Current Average</span>
              <span className="font-bold text-lg">92.4</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
              <span className="text-sm text-muted-foreground">Growth Potential</span>
              <span className="font-bold text-green-500 flex items-center gap-1">
                +14.2% <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg">Scoring Leaderboard</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search leaderboard..." 
                className="w-full bg-muted border border-border rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button variant="outline" size="sm" icon={Filter}>Filters</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase">Rank</th>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase">Company</th>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase">AI Score</th>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase">Growth Trend</th>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase">Primary Signal</th>
                <th className="px-6 py-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leadScores.map((score, index) => (
                <tr key={score.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'}`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{score.company}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Enterprise</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-primary">{score.score}</span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden md:block">
                        <div className="h-full bg-primary" style={{ width: `${score.score}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 font-medium ${score.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {score.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      High
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="primary" className="bg-primary/5 text-primary border-primary/20">
                      {score.signals[0]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Fillers */}
              {[3, 4, 5].map(i => (
                <tr key={i} className="group hover:bg-muted/30 transition-colors opacity-70">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-muted text-muted-foreground">
                      #{i}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">Company {i}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-lg text-muted-foreground">{90 - i*2}</span>
                  </td>
                  <td className="px-6 py-4">Stable</td>
                  <td className="px-6 py-4"><Badge variant="muted">Expansion</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeadScoring;
