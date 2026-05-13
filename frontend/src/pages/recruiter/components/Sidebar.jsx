import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  Brain, 
  Target, 
  Send, 
  Search, 
  BarChart3, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../features/auth/authSlice';

const SidebarLink = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`
    }
  >
    <div className="flex-shrink-0">
      <Icon size={20} />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="font-medium whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
    {collapsed && (
      <div className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-border">
        {label}
      </div>
    )}
  </NavLink>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const menuItems = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/companies', icon: Building2, label: 'Companies' },
    { to: '/recruiter/jobs', icon: Briefcase, label: 'Hiring Jobs' },
    { to: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { to: '/recruiter/pipeline', icon: Layers, label: 'Pipeline' },
    { to: '/recruiter/requirements', icon: Brain, label: 'Requirement AI' },
    { to: '/recruiter/lead-scoring', icon: Target, label: 'Lead Scoring' },
    { to: '/recruiter/outreach', icon: Send, label: 'Outreach' },
    { to: '/recruiter/searches', icon: Search, label: 'Saved Searches' },
    { to: '/recruiter/reports', icon: BarChart3, label: 'Reports' },
    { to: '/recruiter/notifications', icon: Bell, label: 'Notifications' },
    { to: '/recruiter/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div 
      animate={{ width: collapsed ? 80 : 260 }}
      className="bg-card border-r border-border h-screen flex flex-col relative transition-all duration-300"
    >
      <div className="p-6 flex items-center gap-3 h-20 border-b border-border overflow-hidden">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <Brain size={24} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            <h1 className="text-lg font-bold leading-tight">HireSense</h1>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase font-bold tracking-wider">Recruiter</span>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {menuItems.map((item) => (
          <SidebarLink 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label} 
            collapsed={collapsed} 
          />
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.div>
  );
};

export default Sidebar;
