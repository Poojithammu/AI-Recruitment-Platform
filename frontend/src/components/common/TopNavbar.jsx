import React from 'react';
import { Bell, Search, Sun, Moon, Command } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const TopNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative group w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-muted/50 border border-transparent rounded-xl leading-5 placeholder-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
            placeholder="Search anything... (Cmd + K)"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-border rounded-md text-[10px] font-medium text-muted-foreground bg-muted">
              <Command size={10} className="mr-1" /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all">
            <Sun size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">{user?.role || 'Guest'}</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px] cursor-pointer active:scale-95 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                {user?.fullName ? (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random&color=fff`} 
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'U'
                )}
              </div>
            </div>
            {/* Dropdown would go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
