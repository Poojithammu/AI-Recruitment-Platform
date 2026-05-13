import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  ChevronLeft,
  Plus,
  X,
  Target,
  FileText,
  Save,
  Globe
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  const [formData, setFormData] = useState({
    jobRole: '',
    companyName: '',
    companyId: '',
    requiredSkills: '',
    hiringLocation: {
      city: '',
      country: 'India',
      remote: false
    },
    experienceRequired: {
      min: 0,
      max: 5,
      raw: ''
    },
    salary: {
      min: '',
      max: '',
      currency: 'INR'
    },
    jobDescription: '',
    employmentType: 'full-time'
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
        experienceRequired: {
          ...formData.experienceRequired,
          raw: `${formData.experienceRequired.min}-${formData.experienceRequired.max} Yrs`
        }
      };

      const response = await api.post('/hiring/jobs', payload);
      
      if (response.data.success) {
        toast.success('Job posted successfully!');
        navigate('/recruiter/jobs');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
          <p className="text-muted-foreground mt-1">Create a new manual job opening for your organization.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Briefcase size={20} className="text-primary" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Role / Title <span className="text-red-500">*</span></label>
              <input 
                required
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Company <span className="text-red-500">*</span></label>
              <select 
                required
                name="companyId"
                value={formData.companyId}
                onChange={(e) => {
                  const company = companies.find(c => c._id === e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    companyId: e.target.value,
                    companyName: company ? company.companyName : ''
                  }));
                }}
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="">Select a company</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Type</label>
              <select 
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Required Skills (Comma separated) <span className="text-red-500">*</span></label>
              <input 
                required
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, AWS"
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Location & Compensation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input 
                name="hiringLocation.city"
                value={formData.hiringLocation.city}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Remote Option</label>
              <div className="flex items-center gap-3 py-3">
                <input 
                  type="checkbox"
                  checked={formData.hiringLocation.remote}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hiringLocation: { ...prev.hiringLocation, remote: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-sm">This is a fully remote position</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Range (Annual)</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <input 
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number"
                  name="experienceRequired.min"
                  value={formData.experienceRequired.min}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <input 
                  type="number"
                  name="experienceRequired.max"
                  value={formData.experienceRequired.max}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Job Description
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={8}
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
              className="w-full bg-muted border border-border rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            icon={Save}
            loading={loading}
          >
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
