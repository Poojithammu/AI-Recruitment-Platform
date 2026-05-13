import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  RefreshCcw, 
  Save, 
  Edit3, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Plus,
  Layout,
  Sparkles,
  Search,
  History,
  Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import api from '../../api';
import toast from 'react-hot-toast';

const RequirementAI = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('extracted');
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.get('/requirements/history');
      setHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load extraction history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleExtract = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    try {
      setIsExtracting(true);
      const response = await api.post('/requirements/extract', { jobDescription });
      
      if (response.data.success) {
        setExtractedData(response.data.data);
        toast.success('Requirements extracted successfully!');
        fetchHistory(); // Refresh history
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error(error.response?.data?.message || 'AI extraction failed. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const loadFromHistory = (item) => {
    setExtractedData(item);
    setJobDescription(item.rawDescription);
    setActiveTab('extracted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Requirement Intelligence</h1>
          <p className="text-muted-foreground mt-1">Transform messy Job Descriptions into structured hiring blueprints.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            icon={History}
            onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            History
          </Button>
          <Button variant="primary" icon={Save}>Save as Template</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input & Results Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Input Card */}
          <Card className="p-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Job Description Input
            </h3>
            <div className="relative">
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description text here..."
                className="w-full min-h-[250px] bg-muted/50 border border-border rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
              {!jobDescription && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                  <Sparkles size={48} className="mb-2" />
                  <p className="text-sm">Enter content to begin AI extraction</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-6">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {jobDescription.length} characters entered
              </p>
              <Button 
                variant="primary" 
                icon={isExtracting ? RefreshCcw : Sparkles}
                onClick={handleExtract}
                loading={isExtracting}
                className="px-8 shadow-lg shadow-primary/20"
              >
                {isExtracting ? 'Extracting Intelligence...' : 'Extract Requirements'}
              </Button>
            </div>
          </Card>

          {/* Results Area */}
          {isExtracting ? renderSkeleton() : extractedData ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <Card className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Brain size={120} />
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <Brain size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Extraction Results</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Processed via {extractedData.aiProvider} AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="px-3 py-1">
                      {extractedData.processingStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Role & Industry */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Role</label>
                      <h4 className="text-2xl font-black mt-2 text-primary">{extractedData.extractedData.role}</h4>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Industry Domain</label>
                      <p className="text-xl font-bold mt-2">{extractedData.extractedData.industry || 'Technology'}</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-primary" />
                        Core Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.extractedData.skills?.map(skill => (
                          <Badge key={skill} variant="primary" className="py-1.5 px-4 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} className="text-secondary" />
                        Preferred Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.extractedData.preferredSkills?.map(skill => (
                          <Badge key={skill} variant="secondary" className="py-1.5 px-4 rounded-lg bg-secondary/5 text-secondary border-secondary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Experience & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-muted/20 border-border p-6 rounded-2xl">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Experience Range</label>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="text-3xl font-black text-primary">
                          {extractedData.extractedData.experience?.min || '0'}-{extractedData.extractedData.experience?.max || 'N/A'}
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Years</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">"{extractedData.extractedData.experience?.text}"</p>
                    </Card>
                    <Card className="bg-muted/20 border-border p-6 rounded-2xl">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Employment Details</label>
                      <div className="space-y-2 mt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-bold">{extractedData.extractedData.employmentType || 'Full-time'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-bold">{extractedData.extractedData.location || 'Remote'}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Key Responsibilities</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {extractedData.extractedData.responsibilities?.map((resp, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-xl group hover:border-primary/50 transition-all">
                          <span className="text-primary font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity">{(i + 1).toString().padStart(2, '0')}</span>
                          <p className="text-sm leading-relaxed">{resp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Data Inspector */}
              <Card className="p-0 overflow-hidden">
                <div className="flex bg-muted/50 border-b border-border">
                  <button 
                    onClick={() => setActiveTab('extracted')}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'extracted' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Raw Intelligence (JSON)
                  </button>
                  <button 
                    onClick={() => setActiveTab('original')}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'original' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Source Document
                  </button>
                </div>
                <div className="p-8">
                  {activeTab === 'extracted' ? (
                    <div className="relative group">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(extractedData.extractedData, null, 2));
                          toast.success('JSON copied to clipboard');
                        }}
                        className="absolute right-4 top-4 p-2 bg-card border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                      >
                        <Copy size={14} />
                      </button>
                      <pre className="bg-[#1e1e1e] p-6 rounded-2xl text-xs font-mono overflow-x-auto text-green-400 border border-border shadow-inner">
                        {JSON.stringify(extractedData.extractedData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {extractedData.rawDescription}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-muted/10 rounded-[40px] border-2 border-dashed border-border/50 animate-in fade-in zoom-in">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
                <Sparkles size={40} />
              </div>
              <h3 className="text-2xl font-bold">Ready for Analysis</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-center">
                Paste a Job Description above and click extract to see the AI magic happen.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar: History & Tips */}
        <div className="space-y-8" id="history-section">
          {/* Recent Extractions */}
          <Card className="p-8">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Recent Extractions
            </h4>
            <div className="space-y-4">
              {loadingHistory ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)
              ) : history.length > 0 ? (
                history.slice(0, 5).map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => loadFromHistory(item)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                        {item.extractedData?.role || 'Job Extraction'}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.processingStatus}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground italic">
                  No history found
                </div>
              )}
            </div>
            {history.length > 5 && (
              <button className="w-full text-center text-xs font-bold text-primary mt-6 hover:underline uppercase tracking-widest">
                View All History
              </button>
            )}
          </Card>

          {/* AI Info Card */}
          <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={48} />
             </div>
            <div className="flex gap-4">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary flex-shrink-0">
                <Brain size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-secondary uppercase tracking-widest">How it works</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Our intelligence engine uses **Gemini 1.5 Flash** to parse your JDs. It automatically identifies:
                </p>
                <ul className="mt-4 space-y-2">
                  {['Role & Level', 'Primary Skills', 'Experience Caps', 'Domain Area'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs font-medium">
                      <div className="w-1 h-1 bg-secondary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-red-500/5 border-red-500/10">
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle size={14} />
              Data Retention
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Extractions are stored for **30 days** in your local history for quality auditing and template creation.
            </p>
            <Button variant="outline" size="sm" icon={Trash2} className="w-full mt-6 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/20">
              Clear History
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequirementAI;
