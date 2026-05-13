import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Plus, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../features/auth/authSlice';

const Navbar = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search candidates, jobs, companies..." 
          className="w-full bg-muted border border-border rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Action */}
        <Button variant="primary" size="sm" icon={Plus} className="hidden sm:flex">
          New Job
        </Button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95 border border-border"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95 border border-border relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold">Notifications</h3>
                  <button className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <p className="text-sm font-medium">New Candidate Match</p>
                      <p className="text-xs text-muted-foreground mt-1">A new candidate matches your "Senior React Dev" role.</p>
                      <p className="text-[10px] text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-border">
                  <button className="text-sm text-muted-foreground hover:text-foreground">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-muted transition-all active:scale-95 border border-border"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs uppercase">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-1 capitalize">{user?.role || 'Recruiter'}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border">
                  <p className="font-bold">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => { navigate('/recruiter/settings'); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors"
                  >
                    <User size={16} /> Profile Settings
                  </button>
                  <button 
                    onClick={() => { navigate('/recruiter/settings'); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors"
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                  <div className="my-1 border-t border-border"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
