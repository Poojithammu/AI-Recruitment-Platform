import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import requirementService from '../services/requirementService';
import toast from 'react-hot-toast';
import { 
  FileText, Brain, History, Download, RefreshCw, 
  CheckCircle, AlertCircle, Briefcase, MapPin, 
  Code, GraduationCap, DollarSign, Clock 
} from 'lucide-react';

const RequirementExtraction = () => {
  const { accessToken: token } = useSelector((state) => state.auth);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('extract'); // 'extract' or 'history'
  const [provider, setProvider] = useState('gemini');

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await requirementService.getHistory(token);
      setHistory(res.data);
    } catch (error) {
      toast.error('Failed to fetch history');
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return toast.error('Please enter a job description');
    
    setLoading(true);
    setResult(null);
    try {
      const res = await requirementService.extractRequirements(jobDescription, token, provider);
      setResult(res.data);
      toast.success('Requirements extracted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.extractedData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `extraction_${result._id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="text-blue-500 h-8 w-8" />
            AI Requirement Extraction
          </h1>
          <p className="text-gray-400 mt-1">Convert unstructured job descriptions into structured hiring intelligence.</p>
        </div>
        
        <div className="flex bg-[#141414] p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setActiveTab('extract')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'extract' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <FileText size={18} /> Extract
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <History size={18} /> History
          </button>
        </div>
      </div>

      {activeTab === 'extract' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-[#141414] border border-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <FileText className="text-blue-500" size={20} /> Job Description
                </h3>
                <select 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-[#1a1a1a] border border-gray-700 text-sm text-gray-300 rounded px-2 py-1 outline-none"
                >
                  <option value="gemini">Gemini 1.5 Pro</option>
                  <option value="openai">OpenAI GPT-4</option>
                </select>
              </div>
              
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-80 bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              
              <button 
                onClick={handleExtract}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Brain size={20} className="group-hover:scale-110 transition-transform" />
                    Extract Requirements
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-[#141414] border border-gray-800 border-dashed rounded-xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-10">
                <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                  <Brain size={48} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">Ready for Extraction</h3>
                <p className="text-gray-500 mt-2 max-w-xs">Enter a job description on the left to see the AI-powered structured output here.</p>
              </div>
            )}

            {loading && (
              <div className="bg-[#141414] border border-gray-800 rounded-xl h-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin"></div>
                  <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
                </div>
                <p className="text-gray-400 font-medium animate-pulse">AI is analyzing requirements...</p>
              </div>
            )}

            {result && (
              <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 space-y-6 overflow-hidden relative group">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={22} /> Result
                  </h3>
                  <button 
                    onClick={handleExportJSON}
                    className="p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm"
                  >
                    <Download size={16} /> Export JSON
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role & Industry */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                      <div className="flex items-center gap-3 mt-1">
                        <Briefcase className="text-blue-500" size={18} />
                        <span className="text-gray-200 font-medium">{result.extractedData.role}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</label>
                      <div className="flex items-center gap-3 mt-1">
                        <Clock className="text-yellow-500" size={18} />
                        <span className="text-gray-200 font-medium">{result.extractedData.experience.text || 'Not Specified'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                      <div className="flex items-center gap-3 mt-1">
                        <MapPin className="text-red-500" size={18} />
                        <span className="text-gray-200 font-medium">{result.extractedData.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Education</label>
                      <div className="flex items-center gap-3 mt-1">
                        <GraduationCap className="text-purple-500" size={18} />
                        <span className="text-gray-200 font-medium">{result.extractedData.education?.[0] || 'Any Graduate'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary Range</label>
                      <div className="flex items-center gap-3 mt-1">
                        <DollarSign className="text-green-500" size={18} />
                        <span className="text-gray-200 font-medium">
                          {result.extractedData.salary.min ? `${result.extractedData.salary.min} - ${result.extractedData.salary.max} ${result.extractedData.salary.currency}` : 'Competitive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Code size={14} /> Core Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {result.extractedData.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-400 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Responsibilities</label>
                  <ul className="space-y-1">
                    {result.extractedData.responsibilities.slice(0, 4).map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-600 uppercase">
                  <span>AI Provider: {result.aiProvider}</span>
                  <span>Time: {result.processingTime}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a1a] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{item.extractedData?.role || 'Failed Extraction'}</div>
                    <div className="text-xs text-gray-500 font-mono">#{item._id.slice(-6)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${item.processingStatus === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {item.processingStatus === 'completed' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {item.processingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.extractedData?.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#1a1a1a] border border-gray-700 text-gray-400 rounded text-[10px]">
                          {skill}
                        </span>
                      ))}
                      {item.extractedData?.skills.length > 3 && <span className="text-[10px] text-gray-600">+{item.extractedData.skills.length - 3} more</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setResult(item);
                        setActiveTab('extract');
                      }}
                      className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No extraction history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequirementExtraction;
