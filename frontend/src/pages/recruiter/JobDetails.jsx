import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, MapPin, Calendar, ExternalLink, ChevronLeft,
  Brain, Zap, Target, DollarSign, Globe, Clock, Sparkles, CheckCircle,
  ArrowUpRight, Users, Code, BarChart3, Eye, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ExportDropdown from '../../components/ui/ExportDropdown';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/hiring/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-3xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
          <Briefcase size={36} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="text-muted-foreground mt-2 text-sm">This job listing doesn't exist or has been removed.</p>
        <Button variant="primary" className="mt-6" icon={ChevronLeft} onClick={() => navigate('/recruiter/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const salaryText = job.salary?.min
    ? `${job.salary.currency || '₹'} ${job.salary.min?.toLocaleString()} – ${job.salary.max?.toLocaleString()}`
    : 'Competitive';

  const expText = job.experienceRequired?.raw
    || (job.experienceRequired?.min != null ? `${job.experienceRequired.min}–${job.experienceRequired.max} Yrs` : 'Not specified');

  return (
    <div className="space-y-8 pb-10 animate-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-blue-500/5 p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex gap-5 items-start">
            <button
              onClick={() => navigate('/recruiter/jobs')}
              className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0 mt-1"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 flex-shrink-0">
              <Briefcase size={28} className="text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Job Listing</span>
                <Badge variant={job.isActive ? 'success' : 'secondary'} className="text-[10px] rounded-full">{job.isActive ? 'Active' : 'Closed'}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{job.jobRole}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 size={13} />
                  {job.companyName}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={13} />
                  {job.hiringLocation?.city || 'Remote'}{job.hiringLocation?.country ? `, ${job.hiringLocation.country}` : ''}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                  <Clock size={13} />
                  {job.employmentType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={Brain}>AI Insight</Button>
            <Button variant="outline" icon={Share2}>Share</Button>
            {job.sourceUrl && (
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={ExternalLink}>View Original</Button>
              </a>
            )}
            <ExportDropdown
              data={[{
                Role: job.jobRole, Company: job.companyName,
                Location: `${job.hiringLocation?.city || 'Remote'}`,
                Type: job.employmentType, Salary: salaryText, Experience: expText,
                Skills: job.requiredSkills?.join(', '), Status: job.isActive ? 'Active' : 'Closed',
                Source: job.source,
              }]}
              fileName={`${job.jobRole?.replace(/\s+/g, '_')}_details`}
              title={`${job.jobRole} – Job Details`}
            />
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Salary Range', value: salaryText, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Experience Required', value: expText, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Employment Type', value: job.employmentType, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', capitalize: true },
          { label: 'Posted Date', value: new Date(job.postedDate || job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border p-5 ${kpi.bg} ${kpi.border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <kpi.icon size={15} className={kpi.color} />
            </div>
            <h3 className={`text-lg font-bold leading-snug ${kpi.color} ${kpi.capitalize ? 'capitalize' : ''}`}>{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase size={15} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg">Job Description</h3>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.jobDescription}
            </div>
          </Card>

          {/* Required Skills */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Code size={15} className="text-violet-400" />
              </div>
              <h3 className="font-bold text-lg">Required Skills</h3>
              <Badge variant="muted" className="ml-auto">{job.requiredSkills?.length || 0} skills</Badge>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {job.requiredSkills?.map((skill, i) => (
                <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-sm font-medium text-violet-400 hover:bg-violet-500/20 transition-colors cursor-default">
                  {skill}
                </motion.span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/15">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap size={15} className="text-primary" />
              </div>
              <h3 className="font-bold">AI Requirements Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-widest">Match Potential</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-primary">85%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Key Signals</p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                    High market demand for {job.requiredSkills?.[0]}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                    Company in active expansion phase
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                    Competitive compensation package
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-5" icon={Users}>Source Similar Profiles</Button>
          </Card>

          {/* Recruiter Contact */}
          {job.recruiterDetails?.name && (
            <Card>
              <h3 className="font-bold mb-5 text-sm uppercase tracking-wider text-muted-foreground">Point of Contact</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">{job.recruiterDetails.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.recruiterDetails.email}</p>
                </div>
              </div>
              {job.recruiterDetails.linkedin && (
                <Button variant="outline" className="w-full mt-5" icon={Globe}
                  onClick={() => window.open(job.recruiterDetails.linkedin, '_blank')}>
                  LinkedIn Profile
                </Button>
              )}
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Metadata</h3>
            <div className="space-y-3">
              {[
                { label: 'Source', value: <Badge variant="muted" className="capitalize">{job.source?.replace('_', ' ')}</Badge> },
                { label: 'Source ID', value: <span className="font-mono text-xs">{job.sourceJobId}</span> },
                { label: 'Scraped At', value: new Date(job.scrapedAt).toLocaleDateString() },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
