import React, { useState } from 'react';
import { Search, Tag, Play, Edit, Trash2, Clock, ChevronRight, Plus, Bookmark, RotateCcw, Filter, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const savedSearches = [
  {
    id: '1',
    name: 'Senior React Devs — Remote',
    query: 'React, Node.js, Remote, 5+ yrs',
    date: '2 days ago',
    results: 48,
    tags: ['Engineering', 'Remote'],
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
  },
  {
    id: '2',
    name: 'AI Researchers — SF',
    query: 'Python, PyTorch, SF, PhD preferred',
    date: '1 week ago',
    results: 12,
    tags: ['AI/ML', 'High Priority'],
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
  },
  {
    id: '3',
    name: 'UX Designers — London',
    query: 'Figma, Product Design, London, 3+ yrs',
    date: '3 days ago',
    results: 27,
    tags: ['Design', 'Europe'],
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
  },
  {
    id: '4',
    name: 'DevOps Engineers — Hybrid',
    query: 'Kubernetes, Terraform, AWS, CI/CD',
    date: '5 days ago',
    results: 34,
    tags: ['Infrastructure', 'Hybrid'],
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
  },
];

const recentHistory = [
  { id: 'h1', query: '"Golang Backend Developer 8+ years"', results: 24, time: 'Yesterday at 4:30 PM' },
  { id: 'h2', query: '"Data Scientist — NLP specialization"', results: 11, time: 'Today at 10:15 AM' },
  { id: 'h3', query: '"Full Stack React + Django Remote"', results: 38, time: '2 days ago' },
];

const SavedSearches = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const filtered = savedSearches.filter(s =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark size={18} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Searches</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Searches</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and rerun your frequent candidate search queries.</p>
        </div>
        <Button variant="primary" icon={Plus}>New Search</Button>
      </div>

      {/* Search bar + stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Filter saved searches..."
            className="w-full bg-card border border-border rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        {[
          { label: 'Saved', value: savedSearches.length, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'Avg. Results', value: Math.round(savedSearches.reduce((a,s) => a + s.results, 0) / savedSearches.length), color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Tags Used', value: [...new Set(savedSearches.flatMap(s => s.tags))].length, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg} ${s.border} flex items-center justify-between`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Saved Search Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`h-full flex flex-col group hover:border-primary/40 transition-all duration-300`}>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <Search size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base group-hover:text-primary transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Last run {item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Query */}
                <div className="flex-1 mb-4">
                  <div className={`p-3 rounded-xl ${item.bg} border ${item.border} mb-4`}>
                    <p className={`text-xs font-mono font-medium ${item.text}`}>
                      "{item.query}"
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] bg-muted border border-border rounded-lg px-2.5 py-1 text-muted-foreground font-medium">
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className={`flex items-center gap-1.5 text-sm font-bold ${item.text}`}>
                    <TrendingUp size={14} />
                    {item.results} results
                  </div>
                  <Button variant="primary" size="sm" icon={Play} className="h-8">Rerun</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 border border-dashed border-border rounded-3xl">
            <Search size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold">No searches found</h3>
            <p className="text-muted-foreground text-sm mt-2">Try adjusting your filter or create a new saved search.</p>
          </div>
        )}
      </div>

      {/* Recent History */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Recent Search History</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <RotateCcw size={12} />Clear history
          </button>
        </div>
        <div className="space-y-2">
          {recentHistory.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Search size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.query}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Found <strong className="text-foreground">{item.results} results</strong> • {item.time}
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20">
                <Bookmark size={12} /> Save
              </button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SavedSearches;
