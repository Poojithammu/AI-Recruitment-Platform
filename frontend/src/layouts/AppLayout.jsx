import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import TopNavbar from '../components/common/TopNavbar';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto p-8 max-w-[1600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
