import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Globe, Users, TrendingUp, Briefcase, ChevronLeft,
  Calendar, ExternalLink, Target, Zap, DollarSign, Activity, Edit,
  ArrowUpRight, MapPin, BarChart3, Sparkles, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import ExportDropdown from '../../components/ui/ExportDropdown';

const trendData = [
  { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 }, { name: 'Apr', value: 61 },
  { name: 'May', value: 67 }, { name: 'Jun', value: 75 },
];

const intelItems = [
  { label: 'Hiring Velocity', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'Company increased job postings by 24% in the last 30 days, specifically in engineering roles.' },
  { label: 'Stability Signal', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'Recent Series B funding of $45M provides strong runway for aggressive team expansion.' },
];

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        toast.error('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in">
        <div className="flex items-center gap-5">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[340px] rounded-3xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
          <Building2 size={36} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Company Not Found</h2>
        <p className="text-muted-foreground mt-2 text-sm">This company does not exist or has been removed.</p>
        <Button variant="primary" className="mt-6" icon={ChevronLeft} onClick={() => navigate('/recruiter/companies')}>
          Back to Companies
        </Button>
      </div>
    );
  }

  const techStack = ['React', 'Node.js', 'AWS', 'Python'];

  return (
    <div className="space-y-8 pb-10 animate-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex gap-5 items-center">
            <button
              onClick={() => navigate('/recruiter/companies')}
              className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 flex-shrink-0">
              <Building2 size={30} className="text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Company Intelligence</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{company.companyName}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a href={company.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Globe size={13} />
                  {company.website?.replace(/https?:\/\//, '')}
                  <ExternalLink size={11} />
                </a>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Target size={13} />
                  {company.industry}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="outline" icon={Edit} onClick={() => navigate(`/recruiter/companies/edit/${id}`)}>Edit</Button>
            <Button variant="outline" icon={Activity}>Market Analysis</Button>
            <Button variant="primary" icon={Zap}>Generate Lead</Button>
            <ExportDropdown
              data={[{
                Company: company.companyName, Website: company.website, Industry: company.industry,
                Size: company.companySize, HiringScore: company.hiringScore, Trend: company.trend,
              }]}
              fileName={`${company.companyName?.replace(/\s+/g, '_')}_profile`}
              title={`${company.companyName} Company Profile`}
            />
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Hiring Score', value: company.hiringScore, sub: 'Top 5%', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Active Openings', value: company.activeJobs || 0, sub: 'Current jobs', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Company Size', value: company.companySize || 'N/A', sub: 'Employees', icon: Users, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Hiring Trend', value: company.trend || 'Stable', sub: 'Current trajectory', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border p-5 ${kpi.bg} ${kpi.border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <h3 className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Chart + Jobs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Chart */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">Hiring Intensity Trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Job posting volume over time</p>
              </div>
              <select className="bg-muted border-none rounded-xl px-3 py-1.5 text-xs font-medium outline-none text-muted-foreground">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[280px]">
              <AnalyticsChart type="area" data={trendData} dataKey="value" color="#3b82f6" />
            </div>
          </Card>

          {/* Current Opportunities */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Current Opportunities</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Active job openings at this company</p>
              </div>
              <Badge variant="outline">{company.jobs?.length || 0} Total</Badge>
            </div>
            <div className="divide-y divide-border">
              {company.jobs && company.jobs.length > 0 ? (
                company.jobs.map(job => (
                  <div key={job._id} className="group p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-primary/5 transition-colors">
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{job.title}</h4>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={11} />Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign size={11} />{job.salaryRange || 'Competitive'}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Job</Button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Briefcase size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">No active job openings at this company.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Intel + About */}
        <div className="space-y-6">
          {/* AI Intel */}
          <Card className="bg-secondary/5 border-secondary/15">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Zap size={16} className="text-secondary" />
              </div>
              <h3 className="font-bold text-lg">AI Intel Summary</h3>
            </div>
            <div className="space-y-3">
              {intelItems.map(item => (
                <div key={item.label} className={`p-4 rounded-xl border ${item.bg} ${item.border}`}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${item.color}`}>{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Tech Stack Focus</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-5" icon={BarChart3}>Download Full Report</Button>
          </Card>

          {/* About */}
          <Card>
            <h3 className="font-bold text-lg mb-4">About {company.companyName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {company.description || `${company.companyName} is a leading player in the ${company.industry} sector, currently experiencing rapid growth and looking for top talent to join their mission.`}
            </p>
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Location & Presence</h4>
              {[
                { icon: Globe, text: 'Global Operations' },
                { icon: Users, text: `${company.companySize || '500+'} Employees` },
                { icon: MapPin, text: 'Multiple Offices' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <item.icon size={14} className="flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
