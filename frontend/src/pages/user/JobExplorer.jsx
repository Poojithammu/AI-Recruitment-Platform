import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ExternalLink, Building, ArrowRight, Zap } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const JobExplorer = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [type]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { search, location, type };
      const response = await api.get('/user/dashboard/jobs', { params });
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Opportunity Explorer</h1>
          <p className="text-muted-foreground mt-2 font-medium">Discover AI-curated roles that match your career trajectory.</p>
        </div>
        <div className="flex bg-primary/5 p-1 rounded-2xl border border-primary/10">
           {['all', 'full-time', 'contract', 'remote'].map(t => (
             <button
               key={t}
               onClick={() => setType(t)}
               className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                 type === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-card/50 backdrop-blur-md p-4 rounded-[32px] border border-border shadow-sm">
         <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search roles, skills or companies..."
              className="w-full pl-12 pr-6 py-4 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="md:col-span-4 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="City, country or remote..."
              className="w-full pl-12 pr-6 py-4 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
         </div>
         <div className="md:col-span-3">
            <Button variant="primary" className="w-full py-4 rounded-2xl h-full" onClick={fetchJobs} loading={loading}>
              Search Opportunities
            </Button>
         </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="bg-card border border-border rounded-[32px] p-8 space-y-4 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-2xl"></div>
                <div className="h-6 bg-muted rounded-lg w-3/4"></div>
                <div className="h-4 bg-muted rounded-lg w-1/2"></div>
                <div className="pt-4 flex gap-2">
                   <div className="h-6 bg-muted rounded-full w-16"></div>
                   <div className="h-6 bg-muted rounded-full w-16"></div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card hover:bg-muted/10 border border-border hover:border-primary/30 rounded-[32px] p-8 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                 <Zap size={80} className="text-primary fill-primary" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                  {job.companyName.charAt(0)}
                </div>
                <Badge variant="outline" className="text-[10px] font-black tracking-widest">{job.source}</Badge>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-black group-hover:text-primary transition-colors line-clamp-1">{job.jobRole}</h3>
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                  <Building size={16} />
                  {job.companyName}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="secondary" icon={MapPin} className="text-[10px]">{job.hiringLocation?.city || 'Remote'}</Badge>
                <Badge variant="primary" icon={Briefcase} className="text-[10px]">{job.employmentType}</Badge>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                 <div className="text-sm font-black">
                    {job.salary?.min ? (
                      <span>₹{(job.salary.min / 100000).toFixed(1)}L - {(job.salary.max / 100000).toFixed(1)}L</span>
                    ) : (
                      <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Competitive</span>
                    )}
                 </div>
                 <button 
                  onClick={() => handleApply(job.sourceUrl)}
                  className="flex items-center gap-2 text-primary font-black text-sm group/btn"
                 >
                    Instant Apply
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-20 bg-card border border-border rounded-[32px]">
           <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Search size={32} />
           </div>
           <h3 className="text-2xl font-black">No matches found</h3>
           <p className="text-muted-foreground mt-2 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default JobExplorer;
