import React, { useState } from 'react';
import {
  Send, Mail, MessageSquare, Clock, BarChart3, Plus, Play, Pause,
  ArrowUpRight, CheckCircle2, Settings2, Zap, Users, MailOpen, Target
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const analyticsData = [
  { name: 'Sent', value: 1240, color: '#3b82f6' },
  { name: 'Opened', value: 856, color: '#8b5cf6' },
  { name: 'Replied', value: 342, color: '#10b981' },
  { name: 'Meetings', value: 86, color: '#f59e0b' },
];

const campaigns = [
  { id: '1', name: 'React Dev Sourcing', platform: 'LinkedIn', status: 'Running', sent: 450, opened: '68%', replies: 24 },
  { id: '2', name: 'AI Researcher Outreach', platform: 'Email', status: 'Paused', sent: 120, opened: '42%', replies: 8 },
  { id: '3', name: 'Q2 Backend Hiring', platform: 'Mixed', status: 'Completed', sent: 800, opened: '75%', replies: 56 },
];

const statusConfig = {
  Running: { variant: 'success', icon: Play },
  Paused: { variant: 'secondary', icon: Pause },
  Completed: { variant: 'primary', icon: CheckCircle2 },
};

const PlatformIcon = ({ platform }) => {
  if (platform === 'LinkedIn') return <FaLinkedin size={14} color="#0077b5" />;
  if (platform === 'Email') return <Mail size={14} className="text-blue-400" />;
  return <MessageSquare size={14} className="text-violet-400" />;
};

const Outreach = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Send size={18} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Automation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Outreach Automation</h1>
          <p className="text-muted-foreground mt-1 text-sm">Automate communication and track engagement across all platforms.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Settings2}>Settings</Button>
          <Button variant="primary" icon={Plus}>New Campaign</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: '2,482', delta: '+12%', icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Open Rate', value: '68.8%', delta: '+5%', icon: MailOpen, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Reply Rate', value: '24.8%', delta: '+3%', icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Pending Follow-ups', value: '42', delta: null, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border p-5 ${kpi.bg} ${kpi.border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon size={14} className={kpi.color} />
              </div>
            </div>
            <h3 className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</h3>
            {kpi.delta && (
              <p className="text-xs text-green-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={11} />{kpi.delta} vs last week
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Analytics + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                Outreach Funnel
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Overall campaign performance across all channels</p>
            </div>
            <ExportDropdown data={analyticsData.map(d => ({ Stage: d.name, Count: d.value }))} fileName="outreach_analytics" title="Outreach Analytics" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} barSize={56}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {analyticsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            {analyticsData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name} <strong className="text-foreground">{d.value.toLocaleString()}</strong></span>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <h3 className="font-bold text-lg mb-6">Platform Breakdown</h3>
          <div className="space-y-4">
            {[
              { platform: 'LinkedIn', icon: FaLinkedin, iconColor: '#0077b5', sent: 1400, pct: 57, bg: 'bg-blue-500' },
              { platform: 'Email', icon: Mail, iconColor: null, sent: 820, pct: 33, bg: 'bg-violet-500' },
              { platform: 'Mixed', icon: MessageSquare, iconColor: null, sent: 262, pct: 10, bg: 'bg-green-500' },
            ].map(p => (
              <div key={p.platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {p.iconColor ? <p.icon size={14} color={p.iconColor} /> : <p.icon size={14} className="text-muted-foreground" />}
                    <span className="font-medium">{p.platform}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{p.sent} sent</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full ${p.bg}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">AI Recommendation</span>
            </div>
            <p className="text-xs text-muted-foreground">LinkedIn campaigns show 42% higher reply rates this week. Consider shifting budget from email campaigns.</p>
          </div>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Campaigns</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{campaigns.length} active campaigns</p>
          </div>
          <ExportDropdown data={campaigns.map(c => ({ Name: c.name, Platform: c.platform, Status: c.status, Sent: c.sent, OpenRate: c.opened, Replies: c.replies }))} fileName="outreach_campaigns" title="Outreach Campaigns" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Sent</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Open Rate</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Replies</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((campaign) => {
                const sc = statusConfig[campaign.status];
                return (
                  <tr key={campaign.id} className="group hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Outreach</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <PlatformIcon platform={campaign.platform} />
                        <span className="text-sm">{campaign.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={sc.variant}>{campaign.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">{campaign.sent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{campaign.opened}</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden md:block">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: campaign.opened }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-400">{campaign.replies}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                          {campaign.status === 'Running' ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Settings2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Outreach;