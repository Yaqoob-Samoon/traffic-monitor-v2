import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center space-y-16 py-20 bg-slate-950 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl relative z-10 px-6"
      >
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">System Online v2.0</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8">
          Traffic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Intelligence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Leverage AI-powered computer vision to monitor traffic flow, detect violations, and optimize city infrastructure with <span className="text-white font-semibold">military-grade precision.</span>
        </p>
        
        <button 
          onClick={() => navigate('/upload')}
          className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900"
        >
          Initialize Monitoring
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-6 relative z-10">
        {[
          { icon: Zap, title: "Zero Latency", desc: " < 50ms processing time via Edge AI" },
          { icon: Cpu, title: "Neural Precision", desc: "99.8% Object recognition accuracy" },
          { icon: ShieldCheck, title: "Vault Security", desc: "AES-256 End-to-end encryption" }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
              <feature.icon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;