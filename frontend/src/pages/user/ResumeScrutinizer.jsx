import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Brain, ArrowRight, Loader2, Sparkles, BarChart3 } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeScrutinizer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a valid PDF resume');
    }
  };

  const handleScrutinize = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/user/dashboard/scrutinize-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAnalysis(response.data.data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error(error);
      toast.error('AI Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in pb-20">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
          Resume Scrutinizer <Sparkles className="text-primary" size={32} />
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Upload your resume and let our Llama-3.3 AI analyze your market fit, identify skill gaps, and provide actionable improvement tips.
        </p>
      </div>

      {!analysis ? (
        <div className="max-w-3xl mx-auto">
           <div 
             className={`border-4 border-dashed rounded-[48px] p-20 flex flex-col items-center text-center transition-all ${
               file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 bg-card/50'
             }`}
           >
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-xl shadow-primary/10">
                 <Upload size={40} />
              </div>
              
              <h2 className="text-2xl font-black mb-4">
                {file ? file.name : 'Drop your resume here'}
              </h2>
              <p className="text-muted-foreground font-medium mb-10">
                Supports PDF format (Max 5MB). AI will extract and analyze your data securely.
              </p>

              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              <div className="flex gap-4">
                <label 
                  htmlFor="resume-upload" 
                  className="px-10 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-sm cursor-pointer transition-all border border-border"
                >
                  Choose PDF
                </label>
                <Button 
                  variant="primary" 
                  className="px-10 py-4 rounded-2xl" 
                  disabled={!file || loading}
                  onClick={handleScrutinize}
                  loading={loading}
                >
                  Analyze with AI
                </Button>
              </div>
           </div>

           {loading && (
             <div className="mt-12 text-center space-y-4">
                <Loader2 className="mx-auto text-primary animate-spin" size={32} />
                <p className="text-sm font-black uppercase tracking-widest text-primary animate-pulse">
                  Grokking your career trajectory...
                </p>
             </div>
           )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
           {/* Top Score Banner */}
           <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-[40px] shadow-2xl shadow-primary/20">
              <div className="bg-background rounded-[38px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Brain size={150} />
                 </div>
                 
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle 
                            cx="64" cy="64" r="56" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            fill="transparent" 
                            className="text-primary/10" 
                          />
                          <circle 
                            cx="64" cy="64" r="56" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={351.85}
                            strokeDashoffset={351.85 - (351.85 * analysis.overallScore) / 100}
                            className="text-primary transition-all duration-1000 ease-out" 
                            strokeLinecap="round"
                          />
                       </svg>
                       <span className="text-4xl font-black">{analysis.overallScore}</span>
                    </div>
                    <div>
                       <h2 className="text-3xl font-black">AI Scrutiny Complete</h2>
                       <p className="text-muted-foreground font-medium mt-1">Your resume has been analyzed across 12 market vectors.</p>
                       <div className="flex gap-3 mt-4">
                          <Badge variant="primary" icon={TrendingUp}>Match: {analysis.marketFit}</Badge>
                       </div>
                    </div>
                 </div>

                 <Button variant="outline" onClick={() => setAnalysis(null)} className="relative z-10">
                    New Analysis
                 </Button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Strengths & Weaknesses */}
              <div className="space-y-8">
                 <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-3">
                       <CheckCircle className="text-success" size={20} /> Core Strengths
                    </h3>
                    <ul className="space-y-4">
                       {analysis.strengths.map((s, i) => (
                         <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"></span>
                            {s}
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-3">
                       <AlertCircle className="text-danger" size={20} /> Improvement Areas
                    </h3>
                    <ul className="space-y-4">
                       {analysis.weaknesses.map((w, i) => (
                         <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0"></span>
                            {w}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>

              {/* Middle/Right: Skills & Tips */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-3">
                       <Target className="text-secondary" size={20} /> Detected Intelligence (Skills)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                       {analysis.skillsFound.map((skill, i) => (
                         <Badge key={i} variant="outline" className="px-4 py-2 font-black uppercase tracking-widest text-[10px]">{skill}</Badge>
                       ))}
                    </div>
                 </div>

                 <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-3">
                       <BarChart3 className="text-primary" size={20} /> Actionable Optimization Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {analysis.improvementTips.map((tip, i) => (
                         <div key={i} className="p-6 bg-muted/30 border border-border rounded-2xl flex gap-4 group hover:bg-primary/5 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                               {i + 1}
                            </div>
                            <p className="text-sm font-medium leading-relaxed">{tip}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-primary p-10 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 overflow-hidden relative">
                    <div className="absolute -right-20 -bottom-20 opacity-10">
                       <Sparkles size={300} />
                    </div>
                    <div className="space-y-2 relative z-10 text-center md:text-left">
                       <h3 className="text-2xl font-black">AI Recommendations</h3>
                       <p className="text-primary-foreground font-medium opacity-90 max-w-md">
                          {analysis.recommendations[0]}
                       </p>
                    </div>
                    <Button variant="outline" className="!bg-white !text-primary !border-white hover:!bg-white/90 relative z-10">
                       Find Matching Jobs <ArrowRight className="ml-2" size={18} />
                    </Button>
                 </div>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeScrutinizer;
