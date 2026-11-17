import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, AlertCircle, Cpu, FileImage, RefreshCw } from 'lucide-react';

const data = [
  { time: '08:00', cars: 120, violations: 5 },
  { time: '10:00', cars: 250, violations: 12 },
  { time: '12:00', cars: 180, violations: 8 },
  { time: '14:00', cars: 300, violations: 25 },
  { time: '16:00', cars: 220, violations: 15 },
  { time: '18:00', cars: 340, violations: 30 },
  { time: '20:00', cars: 160, violations: 10 },
];

const Dashboard = () => {
  const [charts, setCharts] = useState([]);

  // 🟢 NEW: Fetch Real Charts from Backend
  const fetchCharts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/charts');
      const data = await response.json();
      if (Array.isArray(data)) setCharts(data);
    } catch (err) {
      console.error("Error fetching charts:", err);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700 p-8 bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Intelligence Overview</h2>
            <p className="text-slate-400 text-sm mt-1">Real-time analytical aggregation</p>
         </div>
         <button onClick={fetchCharts} className="flex items-center gap-2 bg-slate-900 text-slate-400 px-4 py-2 rounded-lg border border-slate-800 hover:text-white hover:border-cyan-500 transition-all">
            <RefreshCw size={16} /> Refresh Feed
         </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Traffic Density', value: 'High', color: 'text-orange-400', subColor: 'bg-orange-500/10', icon: TrendingUp },
           { label: 'Avg Wait Time', value: '14s', color: 'text-cyan-400', subColor: 'bg-cyan-500/10', icon: Clock },
           { label: 'Active Alerts', value: '3', color: 'text-red-400', subColor: 'bg-red-500/10', icon: AlertCircle },
         ].map((stat, i) => (
           <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group cursor-default">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest group-hover:text-slate-400 transition-colors">{stat.label}</p>
                 <h4 className={`text-4xl font-black mt-3 ${stat.color}`}>{stat.value}</h4>
               </div>
               <div className={`p-4 rounded-xl ${stat.subColor} group-hover:scale-110 transition-transform`}>
                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
             </div>
           </div>
         ))}
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl h-[400px] shadow-2xl relative overflow-hidden">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <span className="w-2 h-6 bg-cyan-500 rounded-sm"></span>
            Volume vs. Violations
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#475569" axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
            <Area type="monotone" dataKey="cars" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCars)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- 🟢 NEW: DYNAMIC ANALYTICS GALLERY --- */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
         <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Cpu className="text-emerald-500" />
                    Neural Network Analytics History
                </h3>
                <p className="text-slate-500 text-sm mt-1 ml-9">
                    Archive of PyTorch/Matplotlib inference graphs.
                </p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {charts.map((chartName, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                    {/* Header Bar */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <FileImage size={16} className="text-slate-400"/>
                            <span className="text-xs font-mono text-slate-300">
                                {chartName.replace('.png', '').toUpperCase()}
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">
                            GENERATED_REPORT
                        </span>
                    </div>

                    {/* The Analytics Image */}
                    <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-slate-800/50">
                        {/* Pointing to the new ai-data route */}
                        <img 
                           // 🟢 FIX: Add '/results/' to the path so it finds the file!
src={`http://localhost:4000/ai-data/results/${chartName}`} 
                            alt="Traffic Analytics Graph" 
                            className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            ))}
            
            {/* Empty State */}
            {charts.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                    <p>No analytics reports generated yet. Run the python script to create one.</p>
                </div>
            )}
         </div>
      </div>
      {/* --- END NEW SECTION --- */}

    </div>
  );
};

export default Dashboard;