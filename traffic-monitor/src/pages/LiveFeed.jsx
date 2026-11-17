import React, { useState, useEffect } from 'react';
import { Play, Pause, Scan, Zap, Shield, AlertTriangle, Radio, Activity } from 'lucide-react';

const LiveFeed = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAI, setShowAI] = useState(true);
  
  // We use a timestamp to force the image to refresh if the connection drops/reconnects
  const [streamUrl, setStreamUrl] = useState('http://localhost:5000/video_feed');

  const togglePlay = () => {
    if (isPlaying) {
        setStreamUrl(''); // Stop stream
    } else {
        setStreamUrl(`http://localhost:5000/video_feed?t=${Date.now()}`); // Restart stream
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">
            Sector 4 <span className="text-slate-600">|</span> Live Feed
          </h2>
          <p className="text-slate-400 mt-2 flex items-center gap-3 text-sm font-mono">
             <Radio className={`w-4 h-4 ${isPlaying ? 'text-emerald-500 animate-pulse' : 'text-red-500'}`} />
             STATUS: {isPlaying ? 'ONLINE_WSS_ENCRYPTED' : 'FEED_PAUSED'}
          </p>
        </div>
        <div className="flex gap-4">
            <button className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-all font-mono text-sm flex items-center gap-2">
                <AlertTriangle size={16} /> REPORT_INCIDENT
            </button>
            <button className="px-5 py-2.5 bg-cyan-600 text-white rounded font-bold text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:bg-cyan-500 transition-all">
                EXPORT LOGS
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[650px]">
        {/* Main Video HUD */}
        <div className="xl:col-span-2 relative bg-black rounded-lg overflow-hidden border-2 border-slate-800 shadow-2xl group flex items-center justify-center">
            
            {/* Decorative Tech Borders */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 z-20"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 z-20"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 z-20"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 z-20"></div>

            {/* LIVE STREAM FEED */}
            {isPlaying ? (
              <img 
                src={streamUrl}
                alt="Live AI Feed"
                className={`w-full h-full object-contain transition-opacity duration-500 ${showAI ? 'opacity-100' : 'opacity-80 blur-sm'}`}
                crossOrigin="anonymous"
              />
            ) : (
               <div className="text-slate-500 font-mono flex flex-col items-center gap-4">
                  <Activity size={48} className="text-slate-700" />
                  <span>SIGNAL_LOST // FEED_PAUSED</span>
               </div>
            )}
          
            {/* Scanning Line Animation (Overlay) */}
            {isPlaying && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan z-10 h-full w-full" />
            )}

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>

            {/* Bottom Control Bar */}
            <div className="absolute bottom-6 left-12 right-12 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded flex items-center px-6 justify-between z-40">
                <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded text-cyan-400 transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="text-xs font-mono text-cyan-500/70 space-x-6 tracking-widest hidden md:block">
                <span>LAT: 34.0522 N</span>
                <span>LON: 118.2437 W</span>
                <span className="text-white">FPS: 30</span>
                </div>
            </div>
        </div>

        {/* Side Stats Panel */}
        <div className="flex flex-col gap-6 h-full">
            {/* KPI Card 1 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                <div className="absolute -right-6 -top-6 text-slate-800 group-hover:text-slate-800/80 transition-colors transform rotate-12">
                    <Scan size={140} />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Real-Time Throughput</h3>
                <div className="text-6xl font-black text-white tracking-tighter z-10">
                   <span className="animate-pulse">--</span>
                </div>
                <div className="mt-6 flex gap-1 z-10">
                   {[1,2,3,4,5,6,7,8,9,10].map(i => (
                       <div key={i} className={`h-10 flex-1 rounded-sm transition-all duration-500 ${i > 6 ? 'bg-slate-800' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} />
                   ))}
                </div>
            </div>

            {/* KPI Card 2 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex-1 flex flex-col justify-center relative hover:border-violet-500/30 transition-colors">
                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Risk Assessment</h3>
                 <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black text-violet-400">Low</span>
                    <span className="text-xs text-emerald-400 font-mono py-1 px-2 bg-emerald-500/10 rounded border border-emerald-500/20">STABLE</span>
                 </div>
                 <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>ACCIDENT PROBABILITY</span>
                        <span className="text-white">2%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full w-[2%] shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
                    </div>
                 </div>
            </div>
            
            {/* Toggle Switches */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAI(!showAI)}>
                    <span className="text-white font-medium flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-yellow-500/10 rounded text-yellow-500"><Zap size={14}/></div>
                        AI Overlays
                    </span>
                    <div className={`w-10 h-5 rounded-full border relative transition-colors ${showAI ? 'bg-emerald-900/40 border-emerald-500/30' : 'bg-slate-700 border-slate-600'}`}>
                        <div className={`absolute top-[2px] w-3.5 h-3.5 rounded-full transition-all ${showAI ? 'right-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'left-0.5 bg-slate-400'}`} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white font-medium flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-blue-500/10 rounded text-blue-500"><Shield size={14}/></div>
                        AES Encryption
                    </span>
                    <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer opacity-50">
                        <div className="absolute right-0.5 top-[2px] w-3.5 h-3.5 bg-slate-400 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;