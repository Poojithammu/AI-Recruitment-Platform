import React, { useState } from 'react';
import { Bell, Brain, User, Send, AlertCircle, MoreVertical, Trash2, Check, X, CheckCheck, Filter, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { notifications as initialNotifications } from '../../services/mockData';

const typeConfig = {
  extraction: { icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'AI Extraction' },
  candidate: { icon: User, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', label: 'Candidate Match' },
  outreach: { icon: Send, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Outreach' },
  default: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'System' },
};

const getTypeConfig = (type) => {
  if (type?.includes('extraction')) return typeConfig.extraction;
  if (type?.includes('candidate')) return typeConfig.candidate;
  if (type?.includes('outreach')) return typeConfig.outreach;
  return typeConfig.default;
};

const tabs = ['All', 'AI Extraction', 'Candidate Match', 'Outreach', 'System'];

const fillerNotifications = [
  { id: 'f1', type: 'system', message: 'Platform version v2.4.0 successfully deployed. New AI matching engine is live.', time: 'Yesterday', read: true },
  { id: 'f2', type: 'system', message: 'Your monthly hiring report is ready for download.', time: '2 days ago', read: true },
  { id: 'f3', type: 'extraction', message: 'Batch requirement extraction for 8 job descriptions completed successfully.', time: '3 days ago', read: true },
];

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [dismissed, setDismissed] = useState(new Set());
  const allNotifications = [...initialNotifications, ...fillerNotifications];

  const unreadCount = allNotifications.filter(n => !n.read && !dismissed.has(n.id)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">Stay updated with AI insights and candidate interactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={CheckCheck}>Mark all read</Button>
          <Button variant="ghost" size="sm" icon={Trash2} className="text-red-500 hover:bg-red-500/10 hover:text-red-500">Clear all</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Unread', value: unreadCount, icon: Bell, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'AI Insights', value: '5', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Matches', value: '3', icon: User, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Outreach', value: '2', icon: Send, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg} ${s.border}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon size={14} className={s.color} />
            </div>
            <p className={`text-2xl font-black mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground flex-shrink-0">
          <Filter size={15} />
        </button>
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        <AnimatePresence>
          {allNotifications.filter(n => !dismissed.has(n.id)).map((note, i) => {
            const config = getTypeConfig(note.type);
            const IconComp = config.icon;
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className={`group relative flex gap-4 p-5 rounded-2xl border transition-all hover:shadow-md ${
                  !note.read
                    ? `${config.bg} ${config.border}`
                    : 'bg-card border-border hover:border-border/80'
                }`}
              >
                {/* Unread dot */}
                {!note.read && (
                  <div className={`absolute top-4 left-4 w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <IconComp size={18} className={config.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>{config.label}</span>
                        {!note.read && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">New</span>}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{note.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{note.time}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Mark as read">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setDismissed(prev => new Set([...prev, note.id]))} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400" title="Dismiss">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {allNotifications.filter(n => !dismissed.has(n.id)).length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <Bell size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold">All caught up!</h3>
            <p className="text-muted-foreground text-sm mt-2">You have no pending notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
