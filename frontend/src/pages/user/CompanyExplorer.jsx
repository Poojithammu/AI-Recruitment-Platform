import React, { useState, useEffect } from 'react';
import { Building2, Search, TrendingUp, Globe, Users, Star, ArrowUpRight, BarChart3 } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const CompanyExplorer = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard/companies');
      setCompanies(response.data.data);
    } catch (error) {
      toast.error('Failed to load company intelligence');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Hiring Intelligence Hub</h1>
          <p className="text-muted-foreground mt-2 font-medium">Insights into companies that are currently expanding their technical teams.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search company intelligence..."
            className="w-full pl-12 pr-6 py-3 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border border-border rounded-[32px] p-8 space-y-6 animate-pulse">
               <div className="w-16 h-16 bg-muted rounded-2xl"></div>
               <div className="h-6 bg-muted rounded-lg w-1/2"></div>
               <div className="h-20 bg-muted rounded-2xl"></div>
            </div>
          ))
        ) : (
          filteredCompanies.map((company) => (
            <motion.div 
              key={company._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border hover:border-primary/30 rounded-[32px] p-8 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary text-2xl font-black shadow-lg shadow-primary/5">
                  {company.companyName.charAt(0)}
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Hiring Score</div>
                   <div className={`text-2xl font-black ${company.hiringScore > 80 ? 'text-success' : 'text-primary'}`}>
                      {company.hiringScore}
                   </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black tracking-tight">{company.companyName}</h3>
                   <a href={company.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-xl transition-all">
                      <Globe size={18} />
                   </a>
                </div>
                <Badge variant="outline" icon={BarChart3} className="text-[10px] uppercase font-black tracking-[0.2em]">
                   {company.industry}
                </Badge>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                   {company.description || 'Enterprise platform specializing in scalable infrastructure and cloud-native solutions.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scale</p>
                    <div className="flex items-center gap-2 text-xs font-bold">
                       <Users size={14} className="text-primary" />
                       {company.companySize || '501-1000'}
                    </div>
                 </div>
                 <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Growth</p>
                    <div className="flex items-center gap-2 text-xs font-bold">
                       <TrendingUp size={14} className="text-success" />
                       {company.trend || 'Stable'}
                    </div>
                 </div>
              </div>

              <button className="w-full py-4 bg-muted hover:bg-primary text-muted-foreground hover:text-white font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                 Explore Opportunities <ArrowUpRight size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyExplorer;
