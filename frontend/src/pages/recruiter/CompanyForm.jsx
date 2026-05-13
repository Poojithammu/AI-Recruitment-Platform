import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  Users, 
  Layout, 
  ChevronLeft,
  Save,
  Info,
  Activity
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    description: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchCompany = async () => {
        try {
          const response = await api.get(`/companies/${id}`);
          const { companyName, website, industry, companySize, description } = response.data;
          setFormData({
            companyName: companyName || '',
            website: website || '',
            industry: industry || '',
            companySize: companySize || '',
            description: description || ''
          });
        } catch (error) {
          console.error('Error fetching company:', error);
          toast.error('Failed to load company details');
          navigate('/recruiter/companies');
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEditMode) {
        await api.put(`/companies/${id}`, formData);
        toast.success('Company updated successfully!');
      } else {
        await api.post('/companies', formData);
        toast.success('Company created successfully!');
      }
      navigate('/recruiter/companies');
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(error.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in">
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
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Company' : 'Add New Company'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Update existing organization details.' : 'Register a new organization in the intelligence system.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 size={20} className="text-primary" />
            Organizational Details
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Technology, Finance"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Size</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <select 
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Description</label>
              <div className="relative">
                <Info className="absolute left-3 top-4 text-muted-foreground" size={18} />
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about the company..."
                  className="w-full bg-muted border border-border rounded-xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            icon={Save}
            loading={saving}
          >
            {isEditMode ? 'Update Company' : 'Create Company'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
