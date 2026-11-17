import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UploadCloud, Radio, BarChart2, Sun, Moon, Menu, ChevronLeft, Hexagon } from 'lucide-react';
// FIX: Added AnimatePresence to the import below
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  // Defaulting to true for the intended Dark Mode aesthetic
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const navItems = [
    { icon: Home, label: 'Overview', path: '/' },
    { icon: UploadCloud, label: 'Data Injection', path: '/upload' },
    { icon: Radio, label: 'Live Uplink', path: '/live' },
    { icon: BarChart2, label: 'Intelligence', path: '/dashboard' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-sm selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Ambient Background Glow (Global) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar - Floating Glass Panel Style */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-30 flex flex-col m-4 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl h-[calc(100vh-32px)]"
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-center border-b border-slate-800/50 relative overflow-hidden">
            {/* Tech Decoration */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
          <div className="flex items-center gap-4 z-10">
             <div className="relative w-10 h-10 flex items-center justify-center group cursor-pointer">
               <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg group-hover:bg-cyan-500/40 transition-all duration-500" />
               <div className="relative bg-slate-900 border border-slate-700 p-2 rounded-lg group-hover:border-cyan-500/50 transition-colors">
                 <Hexagon className="text-cyan-400 w-6 h-6 fill-cyan-900/20" />
               </div>
             </div>
             
             <AnimatePresence>
               {isSidebarOpen && (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }} 
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="flex flex-col"
                 >
                   <span className="font-black text-xl tracking-tight text-white leading-none">
                     TRAFFIC<span className="text-cyan-500">.AI</span>
                   </span>
                   <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mt-1">
                     System v2.0
                   </span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div className={`relative flex items-center px-4 py-4 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden
                  ${isActive 
                    ? 'bg-slate-800/50 text-cyan-400 shadow-[inset_3px_0_0_0_#06b6d4]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-300 ${!isActive && 'group-hover:opacity-100'}`} />

                  <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'group-hover:scale-105'}`} />
                  
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className={`ml-4 font-bold text-sm tracking-wide relative z-10 ${isActive ? 'text-white' : ''}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active Indicator Pulse */}
                  {isActive && isSidebarOpen && (
                     <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer Toggle / Controls */}
        <div className="p-4 border-t border-slate-800/50 flex flex-col gap-3 relative">
          
          {/* Theme Toggle (Styled for Tech feel) */}
          {isSidebarOpen ? (
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-600 transition-all group"
            >
                <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors uppercase">
                    Mode: {darkMode ? 'Stealth' : 'Light'}
                </span>
                {darkMode 
                    ? <Moon className="w-4 h-4 text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" /> 
                    : <Sun className="w-4 h-4 text-amber-400" />
                }
            </button>
          ) : (
             <button onClick={() => setDarkMode(!darkMode)} className="p-3 mx-auto rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
                 {darkMode ? <Moon size={18} /> : <Sun size={18} />}
             </button>
          )}

          {/* Sidebar Collapse */}
          <button 
             onClick={() => setSidebarOpen(!isSidebarOpen)} 
             className="flex items-center justify-center w-full p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-2"
          >
             {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
        <div className="h-full w-full">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;