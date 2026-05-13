import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyRegistration, resetAuthError, setRequiresOTP } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ShieldCheck, Brain, Sparkles, ArrowRight, CheckCircle, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardPath } from '../../utils/redirectUtils';

const FloatingOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none ${className}`} />
);

const roles = [
  {
    value: 'user',
    icon: User,
    label: 'Job Seeker',
    desc: 'Find your next opportunity with AI-matched jobs',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  {
    value: 'recruiter',
    icon: Briefcase,
    label: 'Recruiter',
    desc: 'Hire smarter with AI-powered talent matching',
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  {
    value: 'analyst',
    icon: BarChart3,
    label: 'Analyst',
    desc: 'Deliver data-driven hiring insights at scale',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
];

const InputField = ({ id, label, name, type = 'text', value, onChange, placeholder, icon: Icon, children }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-400">{label}</label>
      <div className={`relative rounded-xl border transition-all duration-300 ${focused ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]' : 'border-white/10 hover:border-white/20'}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon size={15} className={focused ? 'text-blue-400' : 'text-gray-600'} />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          className="w-full bg-transparent pl-10 pr-10 py-3.5 text-white placeholder-gray-600 focus:outline-none text-sm rounded-xl"
        />
        {children && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">{children}</div>
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  const { fullName, email, password, confirmPassword, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, error, loading, requiresOTP, tempEmail } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      if (Array.isArray(error)) {
        error.forEach((err) => toast.error(err.msg || err.message));
      } else {
        toast.error(error);
      }
      dispatch(resetAuthError());
    }
    if (isAuthenticated && user) {
      toast.success('Registration successful!');
      navigate('/profile-setup');
    }
  }, [error, isAuthenticated, user, navigate, dispatch]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(registerUser(formData));
    dispatch(setRequiresOTP({ requiresOTP: false, email: formData.email }));
  };

  const onVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    dispatch(verifyRegistration({ email: tempEmail || email, otp }));
  };

  const selectedRole = roles.find((r) => r.value === role);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Ambient Orbs */}
      <FloatingOrb className="w-96 h-96 bg-violet-600 -top-32 -right-32" />
      <FloatingOrb className="w-80 h-80 bg-blue-600 bottom-0 left-10" />
      <FloatingOrb className="w-64 h-64 bg-emerald-500 top-1/3 right-1/3" />

      {/* Left Branding Panel */}
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

        {/* Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-violet-300">
            <Sparkles size={14} />
            Join 50,000+ professionals today
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Start your journey<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              with AI hiring
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Whether you're looking for talent or a new role, HireSense AI gives you the intelligence edge to act first.
          </p>

          {/* Role previews */}
          <div className="space-y-3 pt-2">
            {roles.map((r) => (
              <div key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${role === r.value ? `${r.bg} ${r.border}` : 'border-white/5 bg-white/[0.02]'}`}>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                  <r.icon size={14} className="text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${role === r.value ? r.text : 'text-gray-400'}`}>{r.label}</p>
                  <p className="text-xs text-gray-600">{r.desc}</p>
                </div>
                {role === r.value && <CheckCircle size={14} className={`ml-auto ${r.text}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-gray-700">No credit card required · Free forever for job seekers</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 relative z-10 overflow-y-auto py-10">
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

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {requiresOTP ? (
                /* OTP Verification Screen */
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                      <ShieldCheck size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Check your email
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                      We sent a 6-digit code to{' '}
                      <span className="text-blue-400 font-medium">{tempEmail || email}</span>
                    </p>
                  </div>

                  <form onSubmit={onVerifyOTP} className="space-y-5">
                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400 text-center">Verification Code</label>
                      <div className={`relative rounded-xl border transition-all duration-300 ${otpFocused ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]' : 'border-white/10 hover:border-white/20'}`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ShieldCheck size={15} className={otpFocused ? 'text-blue-400' : 'text-gray-600'} />
                        </div>
                        <input
                          type="text"
                          maxLength="6"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          onFocus={() => setOtpFocused(true)}
                          onBlur={() => setOtpFocused(false)}
                          placeholder="000000"
                          className="w-full bg-transparent pl-10 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none text-2xl tracking-[0.6em] text-center font-bold rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-center">{otp.length}/6 digits entered</p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
                        style={{ width: `${(otp.length / 6) * 100}%` }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Complete Signup
                          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(setRequiresOTP({ requiresOTP: false, email: null }))}
                      className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      ← Back to Registration
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Registration Form */
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-7">
                    <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Create account
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    {/* Role Selector */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">I am a...</label>
                      <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, role: r.value }))}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-300 ${
                              role === r.value
                                ? `${r.bg} ${r.border} ${r.text} shadow-lg ${r.glow}`
                                : 'border-white/10 text-gray-600 hover:border-white/20 hover:text-gray-500'
                            }`}
                          >
                            <r.icon size={18} />
                            <span className="text-[11px] font-medium leading-tight">{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Name */}
                    <InputField id="fullName" label="Full Name" name="fullName" value={fullName} onChange={onChange} placeholder="John Doe" icon={User} />

                    {/* Email */}
                    <InputField id="email" label="Email address" name="email" type="email" value={email} onChange={onChange} placeholder="you@company.com" icon={Mail} />

                    {/* Password */}
                    <InputField id="password" label="Password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={onChange} placeholder="Min. 8 characters" icon={Lock}>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-600 hover:text-gray-400 transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </InputField>

                    {/* Confirm Password */}
                    <InputField id="confirmPassword" label="Confirm Password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={onChange} placeholder="Re-enter your password" icon={Lock}>
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-gray-400 transition-colors">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </InputField>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <p className={`text-xs flex items-center gap-1.5 ${password === confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                        <CheckCircle size={12} />
                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${selectedRole?.color || 'from-blue-600 to-violet-600'} hover:opacity-90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg ${selectedRole?.glow} hover:scale-[1.01] active:scale-[0.99] mt-2`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending verification...
                        </>
                      ) : (
                        <>
                          Create {selectedRole?.label} Account
                          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-gray-700 pt-1">
                      By signing up, you agree to our{' '}
                      <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Terms</span>
                      {' '}and{' '}
                      <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
