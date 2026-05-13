import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  Globe, 
  Search,
  Filter,
  DollarSign,
  Activity,
  ChevronRight,
  Briefcase,
  Plus
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ExportDropdown from '../../components/ui/ExportDropdown';

const CompanyCard = ({ company, onClick }) => (
  <Card className="flex flex-col h-full hover:border-primary/50 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Building2 size={28} />
        </div>
        <div>
          <h4 className="font-bold text-xl">{company.companyName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Globe size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{company.website?.replace('https://', '').replace('http://', '')}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Hiring Score</div>
        <div className="text-2xl font-black text-primary">{company.hiringScore}</div>
      </div>
    </div>

    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Industry</span>
        <span className="font-medium">{company.industry}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Hiring Trend</span>
        <Badge variant={company.trend === 'Rapid Growth' ? 'success' : 'secondary'} className="flex items-center gap-1">
          <TrendingUp size={12} /> {company.trend || 'Stable'}
        </Badge>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Active Openings</span>
        <span className="font-bold">{company.activeJobs || 0} Jobs</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-8">
      <div className="p-3 bg-muted/50 rounded-xl border border-border text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">Size</p>
        <p className="text-sm font-bold mt-1 text-primary">{company.companySize || 'N/A'}</p>
      </div>
      <div className="p-3 bg-muted/50 rounded-xl border border-border text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">Signal</p>
        <p className="text-sm font-bold mt-1">Expansion</p>
      </div>
    </div>

    <Button 
      variant="outline" 
      className="w-full mt-6" 
      icon={ChevronRight}
      onClick={() => onClick(company._id)}
    >
      View Intel Report
    </Button>
  </Card>
);

const CompanyIntelligence = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Intelligence</h1>
          <p className="text-muted-foreground mt-1">AI-driven insights into company hiring patterns and stability.</p>
        </div>
        <div className="flex gap-3">
          {!loading && companies.length > 0 && (
            <ExportDropdown 
              data={companies.map(c => ({
                Company: c.companyName,
                Website: c.website,
                Industry: c.industry,
                Size: c.companySize,
                Trend: c.trend || 'Stable',
                ActiveJobs: c.activeJobs || 0,
                HiringScore: c.hiringScore
              }))}
              fileName="company_intelligence_data"
              title="Company Intelligence & Hiring Analysis"
            />
          )}
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={() => navigate('/recruiter/companies/new')}
          >
            Add Company
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by company name, industry, or signals..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 appearance-none outline-none focus:ring-2 focus:ring-primary">
            <option>All Industries</option>
            <option>Software</option>
            <option>AI/ML</option>
            <option>Fintech</option>
          </select>
        </div>
        <div className="relative">
          <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 appearance-none outline-none focus:ring-2 focus:ring-primary">
            <option>High Growth</option>
            <option>Stable</option>
            <option>Declining</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Monitored Companies</p>
              <h3 className="text-2xl font-bold mt-1">{companies.length}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Building2 size={24} />
            </div>
          </div>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">High Growth Signals</p>
              <h3 className="text-2xl font-bold mt-1">
                {companies.filter(c => c.trend === 'Rapid Growth').length || 12}
              </h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>
        <Card className="bg-secondary/5 border-secondary/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Openings</p>
              <h3 className="text-2xl font-bold mt-1">
                {companies.reduce((acc, c) => acc + (c.activeJobs || 0), 0)}
              </h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <Briefcase size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-[400px] rounded-3xl" />
          ))
        ) : (
          filteredCompanies.map(company => (
            <CompanyCard 
              key={company._id} 
              company={company} 
              onClick={(id) => navigate(`/recruiter/companies/${id}`)}
            />
          ))
        )}
      </div>

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
          <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">No companies found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyIntelligence;
