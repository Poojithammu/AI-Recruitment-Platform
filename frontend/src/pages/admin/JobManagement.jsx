import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { Briefcase, Search, Filter, RefreshCcw, Trash2, ExternalLink, MapPin, Building, Calendar, Globe, Plus, Edit3, Eye } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'add', 'edit', 'view'
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    jobRole: '',
    companyName: '',
    source: 'manual',
    sourceUrl: '',
    sourceJobId: '',
    jobDescription: '',
    isActive: true,
    hiringLocation: { city: '', country: '', remote: false },
    salary: { min: '', max: '', currency: 'INR' }
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/jobs');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, job = null) => {
    setModalType(type);
    setSelectedJob(job);
    if (job) {
      setFormData({
        jobRole: job.jobRole || '',
        companyName: job.companyName || '',
        source: job.source || 'manual',
        sourceUrl: job.sourceUrl || '',
        sourceJobId: job.sourceJobId || '',
        jobDescription: job.jobDescription || '',
        isActive: job.isActive !== undefined ? job.isActive : true,
        hiringLocation: { 
          city: job.hiringLocation?.city || '', 
          country: job.hiringLocation?.country || '', 
          remote: job.hiringLocation?.remote || false 
        },
        salary: { 
          min: job.salary?.min || '', 
          max: job.salary?.max || '', 
          currency: job.salary?.currency || 'INR' 
        }
      });
    } else {
      setFormData({
        jobRole: '',
        companyName: '',
        source: 'manual',
        sourceUrl: '',
        sourceJobId: `MAN-${Date.now()}`,
        jobDescription: '',
        isActive: true,
        hiringLocation: { city: '', country: '', remote: false },
        salary: { min: '', max: '', currency: 'INR' }
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        // Need to generate hash and other fields backend expects or handle in controller
        await api.post('/hiring/jobs', formData); // Backend route for creating jobs
        toast.success('Job created successfully');
      } else if (modalType === 'edit') {
        await api.put(`/admin/jobs/${selectedJob._id}`, formData);
        toast.success('Job updated successfully');
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = !job.isActive;
      await api.put(`/admin/jobs/${job._id}`, { isActive: newStatus });
      toast.success(`Job ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    
    try {
      await api.delete(`/admin/jobs/${id}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'Job Information', 
      accessor: 'jobRole',
      render: (val, row) => (
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleOpenModal('view', row)}>
          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-sm">
            {row.companyName.charAt(0)}
          </div>
          <div>
            <p className="font-black text-sm">{val}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
              <Building size={10} />
              {row.companyName}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Source & Type', 
      accessor: 'source',
      render: (val, row) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-muted/30">
            {val}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin size={10} />
            {row.hiringLocation?.city || 'Remote'}
          </div>
        </div>
      )
    },
    { 
      header: 'Listing Status', 
      accessor: 'isActive',
      render: (val, row) => (
        <button 
          onClick={() => handleToggleStatus(row)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
            val ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-tight">{val ? 'Live' : 'Inactive'}</span>
        </button>
      )
    },
    { 
      header: 'Discovery Date', 
      accessor: 'createdAt',
      render: (val) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={12} />
          {new Date(val).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Link',
      accessor: 'sourceUrl',
      render: (val) => (
        <a href={val} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors inline-block">
          <ExternalLink size={14} />
        </a>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Job Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage all collected job listings and their publication status.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" icon={RefreshCcw} onClick={fetchJobs} loading={loading}>Refresh Inventory</Button>
          <Button variant="primary" icon={Plus} onClick={() => handleOpenModal('add')}>Create Listing</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Inventory" value={jobs.length} icon={Briefcase} color="primary" />
        <StatCard title="Live Listings" value={jobs.filter(j => j.isActive).length} icon={RefreshCcw} color="success" />
        <StatCard title="Hidden / Drafts" value={jobs.filter(j => !j.isActive).length} icon={Trash2} color="warning" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-md p-6 rounded-[32px] border border-border/50">
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by role, company or tech..."
              className="w-full pl-12 pr-6 py-3 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
          <DataTable 
            columns={columns} 
            data={filteredJobs} 
            loading={loading}
            onView={(row) => handleOpenModal('view', row)}
            onEdit={(row) => handleOpenModal('edit', row)}
            onDelete={(row) => handleDeleteJob(row._id)}
            pagination={true} 
          />
        </div>
      </div>

      {/* Job Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size={modalType === 'view' ? 'lg' : 'md'}
        title={modalType === 'view' ? 'Job Discovery Details' : modalType === 'edit' ? 'Edit Job Listing' : 'Manually Create Listing'}
      >
        {modalType === 'view' ? (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-border">
              <div className="w-20 h-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary text-3xl font-black">
                {selectedJob?.companyName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black">{selectedJob?.jobRole}</h3>
                    <p className="text-xl text-muted-foreground font-bold mt-1 uppercase tracking-tight">{selectedJob?.companyName}</p>
                  </div>
                  <a href={selectedJob?.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 !px-4 !py-2 !rounded-xl !text-xs">
                    <ExternalLink size={14} /> View Original
                  </a>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">{selectedJob?.source}</Badge>
                  <Badge variant={selectedJob?.isActive ? 'success' : 'danger'}>
                    {selectedJob?.isActive ? 'Live Listing' : 'Hidden'}
                  </Badge>
                  <Badge variant="secondary">{selectedJob?.employmentType}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <div className="flex items-center gap-2 font-bold">
                  <MapPin size={18} className="text-primary" />
                  {selectedJob?.hiringLocation?.city}, {selectedJob?.hiringLocation?.country}
                  {selectedJob?.hiringLocation?.remote && <Badge variant="success" className="ml-2 text-[8px]">Remote</Badge>}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Compensation</p>
                <div className="flex items-center gap-2 font-bold">
                  <Globe size={18} className="text-primary" />
                  {selectedJob?.salary?.min ? `${selectedJob.salary.min} - ${selectedJob.salary.max} ${selectedJob.salary.currency}` : 'Competitive'}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Discovered On</p>
                <div className="flex items-center gap-2 font-bold">
                  <Calendar size={18} className="text-primary" />
                  {new Date(selectedJob?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Job Intelligence / Description</p>
               <div className="bg-muted/30 border border-border p-6 rounded-3xl text-sm leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar font-medium whitespace-pre-wrap">
                  {selectedJob?.jobDescription}
               </div>
            </div>

            <div className="pt-8 border-t border-border flex gap-4">
               <Button variant="outline" icon={Edit3} onClick={() => handleOpenModal('edit', selectedJob)}>Edit Intelligence</Button>
               <Button variant="danger" icon={Trash2} onClick={() => { setIsModalOpen(false); handleDeleteJob(selectedJob._id); }}>Purge Listing</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Job Title</label>
                <input 
                  name="jobRole"
                  required
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  placeholder="Software Engineer..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Name</label>
                <input 
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  placeholder="Acme Corp..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Source URL</label>
              <input 
                name="sourceUrl"
                required
                value={formData.sourceUrl}
                onChange={handleInputChange}
                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                placeholder="https://example.com/job/123"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">City</label>
                  <input 
                    name="hiringLocation.city"
                    value={formData.hiringLocation.city}
                    onChange={handleInputChange}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</label>
                  <input 
                    name="hiringLocation.country"
                    value={formData.hiringLocation.country}
                    onChange={handleInputChange}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Description</label>
              <textarea 
                name="jobDescription"
                required
                rows={6}
                value={formData.jobDescription}
                onChange={handleInputChange}
                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold resize-none"
                placeholder="Paste job description here..."
              />
            </div>

            <div className="pt-6 flex gap-4">
              <Button type="submit" variant="primary" className="flex-1 py-4">
                {modalType === 'add' ? 'Publish Listing' : 'Save Intelligence'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
