import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetAuthError } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Brain, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardPath } from '../../utils/redirectUtils';

const FloatingOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`} />
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthError());
    }
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(from || dashboardPath, { replace: true });
    }
  }, [error, isAuthenticated, user, navigate, dispatch, from]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all fields');
      return;
    }
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Background ambient glow */}
      <FloatingOrb className="w-96 h-96 bg-blue-600 -top-20 -left-20" />
      <FloatingOrb className="w-80 h-80 bg-violet-600 bottom-10 right-10" />
      <FloatingOrb className="w-64 h-64 bg-cyan-500 top-1/2 left-1/3" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            HireSense <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full ml-1">AI</span>
          </span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-blue-300">
            <Sparkles size={14} />
            Powered by Advanced AI Intelligence
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Hire smarter,<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              faster & better
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            The AI-driven recruitment platform that matches top talent with your open roles — before your competitors even know they exist.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {['AI Candidate Matching', 'Real-time Trends', 'Smart Outreach', 'Lead Scoring'].map((feat) => (
              <span key={feat} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: '50K+', label: 'Candidates' },
            { value: '98%', label: 'Match Rate' },
            { value: '3x', label: 'Faster Hiring' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Brain size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>HireSense AI</span>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            {/* Form Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-blue-400" />
                <span className="text-xs text-blue-400 font-medium uppercase tracking-widest">Secure Login</span>
              </div>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome back
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email address
                </label>
                <div className={`relative rounded-xl border transition-all duration-300 ${
                  focused === 'email'
                    ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                    : 'border-white/10 hover:border-white/20'
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className={focused === 'email' ? 'text-blue-400' : 'text-gray-600'} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={onChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className="w-full bg-transparent pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none text-sm rounded-xl"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <div className={`relative rounded-xl border transition-all duration-300 ${
                  focused === 'password'
                    ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                    : 'border-white/10 hover:border-white/20'
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className={focused === 'password' ? 'text-blue-400' : 'text-gray-600'} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={onChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    className="w-full bg-transparent pl-11 pr-11 py-3.5 text-white placeholder-gray-600 focus:outline-none text-sm rounded-xl"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-transparent accent-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-gray-600">Protected by AES-256</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
          </div>

          <p className="text-center text-xs text-gray-700 mt-6">
            By signing in, you agree to our{' '}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Terms</span>
            {' '}and{' '}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
