import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Brain, 
  Users, 
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Trash2,
  Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import api from '../../api';
import toast from 'react-hot-toast';
import ExportDropdown from '../../components/ui/ExportDropdown';

const Jobs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchJobs = useCallback(async (page = 1, search = searchTerm, status = filterStatus) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: pagination.limit,
        company: search || undefined
      };

      if (status === 'Active') params.isActive = 'true';
      if (status === 'Closed') params.isActive = 'false';
      // For 'Interviewing', we don't have a direct backend filter yet, so we show all for now
      // or we could add another field to the backend later.

      const response = await api.get('/hiring/jobs', { params });
      
      if (response.data.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, searchTerm, filterStatus]);

  useEffect(() => {
    fetchJobs(pagination.page);
  }, [pagination.page]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1, searchTerm, filterStatus);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus]);

  const deleteJob = async (e, id) => {
    e.stopPropagation(); // Prevent row click
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/hiring/jobs/${id}`);
      toast.success('Job deleted successfully');
      fetchJobs(pagination.page);
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleRowClick = (id) => {
    navigate(`/recruiter/jobs/${id}`);
  };

  return (
    <div className="space-y-6 pb-10 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hiring Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage your active job openings and AI-powered requirements.</p>
        </div>
        <div className="flex gap-3">
          {!loading && jobs.length > 0 && (
            <ExportDropdown 
              data={jobs.map(j => ({
                Role: j.jobRole,
                Company: j.companyName,
                Location: j.hiringLocation?.city || 'Remote',
                Type: j.employmentType,
                Status: j.isActive ? 'Active' : 'Inactive',
                Posted: new Date(j.postedDate || j.createdAt).toLocaleDateString()
              }))}
              fileName="hiring_jobs_list"
              title="Full Hiring Jobs Inventory"
            />
          )}
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={() => navigate('/recruiter/jobs/new')}
          >
            Post New Job
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="py-4 px-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search by company or role..." 
              className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Active', 'Interviewing', 'Closed'].map(status => (
              <Badge 
                key={status}
                variant={filterStatus === status ? 'primary' : 'muted'} 
                className="cursor-pointer px-4 py-1.5 whitespace-nowrap hover:opacity-80 transition-opacity"
                onClick={() => {
                  setFilterStatus(status);
                  setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
                }}
              >
                {status}
              </Badge>
            ))}
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Button variant="ghost" size="sm" icon={Filter}>Filters</Button>
          </div>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Job Role & Company</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Skills Required</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Location & Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Posted Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan="6" className="px-6 py-6"><Skeleton className="h-10 w-full rounded-lg" /></td>
                  </tr>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr 
                    key={job._id} 
                    className="group hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => handleRowClick(job._id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">{job.jobRole}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 size={12} /> {job.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {job.requiredSkills?.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium border border-border group-hover:border-primary/20 transition-colors">
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills?.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{job.requiredSkills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-foreground capitalize">
                        <MapPin size={12} className="text-muted-foreground" />
                        {job.hiringLocation?.city || 'Remote'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{job.employmentType}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(job.postedDate || job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={job.isActive ? 'success' : 'secondary'} className="rounded-full px-3">
                        {job.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(job._id);
                          }}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="AI Extraction"
                        >
                          <Brain size={18} />
                        </button>
                        <button 
                          onClick={(e) => deleteJob(e, job._id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Building2 size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-bold">No jobs found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                      <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setFilterStatus('All'); fetchJobs(1, '', 'All');}}>
                        Clear All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
            <p>Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs</p>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-muted rounded-lg disabled:opacity-30 transition-colors" 
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-all ${
                      pagination.page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                className="p-2 hover:bg-muted rounded-lg disabled:opacity-30 transition-colors"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Jobs;
