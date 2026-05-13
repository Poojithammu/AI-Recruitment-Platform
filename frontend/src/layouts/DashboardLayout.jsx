import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Briefcase, TrendingUp, Users, FileText, Settings, Bell, Shield, Database, Activity, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/redirectUtils';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-text-muted hover:bg-card hover:text-white'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const { user, isAdmin, isRecruiter, isAnalyst } = useAuth();
  const dashboardPath = getDashboardPath(user?.role);

  return (
    <div className="flex h-screen bg-background text-text-main overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-card border-r border-gray-800 flex flex-col"
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <TrendingUp size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI HireSense
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2 px-4">Overview</div>
          <SidebarItem to={dashboardPath} icon={LayoutDashboard} label="Dashboard" />
          
          {(isAdmin || isAnalyst || user?.role === 'user') && (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6 px-4">Analytics</div>
              <SidebarItem to="/trends" icon={TrendingUp} label="Hiring Trends" />
            </>
          )}
          
          {(isAdmin || isRecruiter || user?.role === 'user') && (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6 px-4">Database</div>
              <SidebarItem to="/companies" icon={Building2} label="Companies" />
              <SidebarItem to="/jobs" icon={Briefcase} label="Jobs" />
              <SidebarItem to="/requirements" icon={Brain} label="Requirement AI" />
              {(isAdmin || isRecruiter) && <SidebarItem to="/recruiters" icon={Users} label="Recruiters" />}
            </>
          )}
          
          {(isAdmin || isRecruiter || isAnalyst) && (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6 px-4">Tools</div>
              <SidebarItem to="/reports" icon={FileText} label="Reports" />
              {isAdmin && (
                <>
                  <SidebarItem to="/admin/scrapers" icon={Activity} label="Monitor Scrapers" />
                  <SidebarItem to="/admin/logs" icon={Database} label="System Logs" />
                </>
              )}
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <SidebarItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center text-sm text-text-muted">
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md border border-green-500/20 text-xs font-medium mr-3">System Active</span>
            <span className="hidden md:inline">Last sync: Just now</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs text-text-muted capitalize">{user?.role || 'Guest'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-card shadow-md flex items-center justify-center text-white font-bold cursor-pointer">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-[#0b1121] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
