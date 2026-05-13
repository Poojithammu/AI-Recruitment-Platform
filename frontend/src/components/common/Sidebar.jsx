import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Brain, 
  TrendingUp, 
  Database,
  UserCircle,
  LogOut,
  Building2,
  FileText,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user, isAdmin, isRecruiter, isAnalyst } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 uppercase font-bold tracking-wider">Admin</span>;
    if (isRecruiter) return <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-bold tracking-wider">Recruiter</span>;
    if (isAnalyst) return <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full border border-purple-500/20 uppercase font-bold tracking-wider">Analyst</span>;
    return <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 uppercase font-bold tracking-wider">User</span>;
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col overflow-hidden">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <Brain size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">HireSense</h1>
          {getRoleBadge()}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-4 px-4">Core</div>
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Overview" />

        {/* Admin Specific Links */}
        {isAdmin && (
          <>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-6 px-4">Management</div>
            <SidebarLink to="/admin/dashboard" icon={LayoutDashboard} label="Admin Dashboard" />
            <SidebarLink to="/admin/users" icon={Users} label="System Users" />
            <SidebarLink to="/admin/candidates" icon={UserCircle} label="Candidates" />
            <SidebarLink to="/admin/recruiters" icon={Building2} label="Recruiters" />
            <SidebarLink to="/admin/jobs" icon={Briefcase} label="Job Inventory" />
            <SidebarLink to="/admin/scrapers" icon={Activity} label="System Status" />
          </>
        )}

        {/* Recruiter Specific Links */}
        {(isRecruiter || isAdmin) && (
          <>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-6 px-4">Hiring Tools</div>
            <SidebarLink to="/recruiter/intelligence" icon={TrendingUp} label="Intelligence Hub" />
            <SidebarLink to="/recruiter/extraction" icon={Brain} label="AI Extraction" />
            <SidebarLink to="/recruiter/explorer" icon={Briefcase} label="Job Explorer" />
          </>
        )}

        {/* Analyst Specific Links */}
        {(isAnalyst || isAdmin) && (
          <>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-6 px-4">Data Analysis</div>
            <SidebarLink to="/analyst/data" icon={Database} label="Data Explorer" />
            <SidebarLink to="/analyst/trends" icon={TrendingUp} label="Trend Analysis" />
            <SidebarLink to="/analyst/sources" icon={FileText} label="Source Analytics" />
          </>
        )}

        {/* Regular User Links */}
        {!isAdmin && !isRecruiter && !isAnalyst && (
          <>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-6 px-4">Career Hub</div>
            <SidebarLink to="/user/jobs" icon={Briefcase} label="Job Explorer" />
            <SidebarLink to="/user/companies" icon={Building2} label="Company Insights" />
            <SidebarLink to="/user/resume-scrutinizer" icon={Brain} label="Resume Scrutinizer" />
          </>
        )}

        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 mt-6 px-4">Personal</div>
        <SidebarLink to="/profile" icon={UserCircle} label="Profile" />
        <SidebarLink to="/settings" icon={Settings} label="Settings" />
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
