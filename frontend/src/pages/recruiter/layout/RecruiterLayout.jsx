import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const RecruiterLayout = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="flex-1 overflow-y-auto bg-background/50 p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
