import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileService from '../services/profileService';
import toast from 'react-hot-toast';
import {
  Briefcase, MapPin, GraduationCap, Code, Rocket,
  User, BarChart, Brain, CheckCircle, ArrowRight,
  Building2, Globe, Clock, Layers
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPath } from '../utils/redirectUtils';

const ROLE_CONFIG = {
  recruiter: {
    icon: Briefcase,
    label: 'Recruiter',
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/25',
    description: 'Set up your recruiter profile to start matching top talent with open roles.',
    steps: ['Company Info', 'Hiring Focus', 'Contact'],
  },
  analyst: {
    icon: BarChart,
    label: 'Analyst',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/25',
    description: 'Configure your analyst profile to start delivering market insights.',
    steps: ['Specialization', 'Experience', 'Bio'],
  },
  user: {
    icon: User,
    label: 'Job Seeker',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/25',
    description: 'Build your candidate profile to get matched with the best opportunities.',
    steps: ['Skills', 'Location', 'Preferences'],
  },
};

const InputField = ({ icon: Icon, label, name, value, onChange, placeholder, type = 'text', required, hint, textarea }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-400">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
      <div className={`relative rounded-xl border transition-all duration-300 ${
        focused
          ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
          : 'border-white/10 hover:border-white/20'
      }`}>
        <div className={`absolute left-4 flex items-center pointer-events-none ${textarea ? 'top-3.5' : 'inset-y-0'}`}>
          <Icon size={15} className={focused ? 'text-blue-400' : 'text-gray-600'} />
        </div>
        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-transparent pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm rounded-xl resize-none"
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            required={required}
            className="w-full bg-transparent pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none text-sm rounded-xl"
          />
        )}
      </div>
    </div>
  );
};

const ProfileSetup = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    companyName: '', designation: '', hiringFocus: '', linkedInUrl: '',
    officeLocation: '', specialization: '', industriesCovered: '',
    yearsOfExperience: '', bio: '', skills: '', experienceLevel: 'junior',
    preferredLocations: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const processed = { ...formData };
      ['hiringFocus', 'industriesCovered', 'skills', 'preferredLocations'].forEach((key) => {
        if (formData[key]) {
          processed[key] = formData[key].split(',').map((s) => s.trim());
        }
      });

      await profileService.createOrUpdateProfile(processed, accessToken);
      toast.success('Profile completed! Welcome aboard 🎉');
      navigate(getDashboardPath(user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const role = user.role || 'user';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const RoleIcon = config.icon;

  const renderRoleForm = () => {
    if (role === 'recruiter') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField icon={Building2} label="Company Name" name="companyName" value={formData.companyName} onChange={onChange} placeholder="e.g. Google" required />
            <InputField icon={User} label="Designation" name="designation" value={formData.designation} onChange={onChange} placeholder="e.g. Senior Recruiter" required />
          </div>
          <InputField icon={Rocket} label="Hiring Focus" name="hiringFocus" value={formData.hiringFocus} onChange={onChange} placeholder="Frontend, Backend, DevOps" hint="Separate roles with commas" />
          <div className="grid grid-cols-2 gap-4">
            <InputField icon={Globe} label="Industries Covered" name="industriesCovered" value={formData.industriesCovered} onChange={onChange} placeholder="SaaS, Fintech, AI" />
            <InputField icon={MapPin} label="Office Location" name="officeLocation" value={formData.officeLocation} onChange={onChange} placeholder="Hyderabad" />
          </div>
          <InputField icon={FaLinkedin} label="LinkedIn URL" name="linkedInUrl" value={formData.linkedInUrl} onChange={onChange} placeholder="https://linkedin.com/in/username" />
        </div>
      );
    }

    if (role === 'analyst') {
      return (
        <div className="space-y-4">
          <InputField icon={Layers} label="Specialization" name="specialization" value={formData.specialization} onChange={onChange} placeholder="e.g. Talent Market Analyst" required />
          <div className="grid grid-cols-2 gap-4">
            <InputField icon={Clock} label="Years of Experience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={onChange} placeholder="e.g. 5" required />
            <InputField icon={Globe} label="Industries Covered" name="industriesCovered" value={formData.industriesCovered} onChange={onChange} placeholder="SaaS, Fintech" />
          </div>
          <InputField icon={BarChart} label="Bio" name="bio" value={formData.bio} onChange={onChange} placeholder="Tell us about your expertise and background..." textarea />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <InputField icon={Code} label="Skills" name="skills" value={formData.skills} onChange={onChange} placeholder="React, Node.js, Python, TypeScript" hint="Separate skills with commas" required />
        <InputField icon={MapPin} label="Preferred Locations" name="preferredLocations" value={formData.preferredLocations} onChange={onChange} placeholder="Bangalore, Remote, Hyderabad" />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Experience Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['junior', 'mid', 'senior'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, experienceLevel: level }))}
                className={`py-3 px-4 rounded-xl border text-sm font-medium capitalize transition-all duration-300 ${
                  formData.experienceLevel === level
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400'
                }`}
              >
                {level === 'junior' ? '0–2 yrs' : level === 'mid' ? '2–5 yrs' : '5+ yrs'}
                <p className="text-[10px] mt-0.5 font-normal capitalize">{level}</p>
              </button>
            ))}
          </div>
        </div>
        <InputField icon={User} label="Bio" name="bio" value={formData.bio} onChange={onChange} placeholder="Brief introduction about yourself and career goals..." textarea />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -top-32 -left-32 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl bottom-0 right-0 pointer-events-none" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between p-12 bg-white/[0.02] border-r border-white/5 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>HireSense AI</span>
        </div>

        {/* Role Badge */}
        <div className="space-y-6">
          <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${config.color} p-[1px] rounded-2xl`}>
            <div className="bg-[#0d0d0d] rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                <RoleIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Setting up as</p>
                <p className="text-white font-bold text-sm">{config.label}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Let's set up<br />
              <span className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                your profile
              </span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">{config.description}</p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {config.steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i === step
                    ? `bg-gradient-to-br ${config.color} border-transparent text-white`
                    : i < step
                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'border-white/10 text-gray-600'
                }`}>
                  {i < step ? <CheckCircle size={12} /> : i + 1}
                </div>
                <span className={`text-sm ${i === step ? 'text-white font-medium' : i < step ? 'text-green-400' : 'text-gray-600'}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Your data is encrypted & secure
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Brain size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>HireSense AI</span>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.color} p-[1px] rounded-full mb-4`}>
                <div className="bg-[#111111] rounded-full px-3 py-1 flex items-center gap-1.5">
                  <RoleIcon size={12} className="text-blue-400" />
                  <span className="text-xs text-gray-400">{config.label} Setup</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Complete Your Profile
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                This helps us personalize your experience and AI recommendations.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderRoleForm()}
                </motion.div>
              </AnimatePresence>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Submit */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full group relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${config.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg ${config.glow} hover:scale-[1.01] active:scale-[0.99]`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving your profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(getDashboardPath(user.role))}
                  className="w-full py-3 text-sm text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Skip for now →
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-gray-700 mt-6">
            You can update your profile anytime from Settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;