import React, { useCallback, useState, useEffect } from 'react'; 
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileVideo, CheckCircle, Loader2, AlertCircle, BarChart, ShieldAlert, Cpu, Image as ImageIcon } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [proofs, setProofs] = useState([]); 

  // Load Proof Images from Backend
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/proofs');
        const data = await response.json();
        
        // Update state with the file names from the folder
        if (Array.isArray(data)) {
            setProofs(data);
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      }
    };

    fetchProofs();
  }, [result]); // Re-run this whenever a new analysis (result) is done

  const onDrop = useCallback(acceptedFiles => {
    setResult(null);
    setError(null);
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video')
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'video/*': [], 'image/*': []},
    maxFiles: 1 
  });

  const handleProcess = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      // Connect to Python AI Engine
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('AI Analysis Failed');
      const data = await response.json();
      
      setResult({
        stats: {
          totalVehicles: data.counts.total,
          trafficDensity: data.density,
          vehicleDistribution: data.counts
        },
        riskEvents: data.riskEvents || [],
        processedPath: data.processedPath,
        accident: data.accident,
        isVideo: data.fileType === 'video'
      });

    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI Engine (Port 5000).");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 py-10 px-6 bg-slate-950 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <Cpu className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">Data Injection</h2>
        <p className="text-slate-400 text-lg max-w-2xl">Upload raw surveillance footage for neural network processing and anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* LEFT: Upload Zone */}
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`relative group overflow-hidden transition-all duration-300 cursor-pointer
            ${isDragActive ? 'scale-[1.02]' : ''}`}
          >
            {/* Animated Border */}
            <div className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-colors duration-300 z-10
                ${isDragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-700 hover:border-cyan-500/50 bg-slate-900/50'}`} 
            />
            
            <input {...getInputProps()} />
            
            <div className="relative z-20 flex flex-col items-center justify-center p-16 gap-6">
              <div className={`p-6 rounded-2xl transition-all duration-500 shadow-2xl
                  ${isDragActive ? 'bg-cyan-500 shadow-cyan-500/50' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <UploadCloud className={`w-12 h-12 ${isDragActive ? 'text-white' : 'text-cyan-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-2">
                  {isDragActive ? "Release to Inject" : "Drag & drop footage"}
                </p>
                <p className="text-slate-500 font-mono text-sm">SUPPORTED FORMATS: MP4, AVI, JPG, PNG</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-md rounded-xl p-5 border border-slate-700 shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    {files[0].isVideo ? <FileVideo className="text-violet-400" size={24} /> : <div className="font-bold text-xs text-violet-400">IMG</div>}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-semibold text-white truncate">{files[0].name}</p>
                    <p className="text-xs font-mono text-slate-400">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {uploading ? <Loader2 className="animate-spin text-cyan-400" /> : <CheckCircle className="text-emerald-500" />}
                </div>
                
                {!result && !uploading && (
                  <button 
                    onClick={handleProcess}
                    className="w-full mt-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3.5 rounded-lg font-bold tracking-wide uppercase transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                  >
                    Initiate Analysis
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="font-mono">{error}</span>
            </div>
          )}

          {/* --- VERIFICATION GALLERY --- */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="text-cyan-500" size={20} /> 
              Visual Verification Gallery
            </h3>
            <p className="text-slate-500 text-sm">
              Live proofs from the AI Engine showing detected crash zones.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {proofs.map((imgName, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 p-2 rounded-xl group relative overflow-hidden">
                  <div className="absolute top-2 left-2 bg-black/70 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md z-10 border border-emerald-500/20">
                    CONFIDENCE &gt; 90%
                  </div>
                  {/* 🟢 UPDATED: Added timestamp to prevent browser caching */}
                  <img 
                    src={`http://localhost:4000/proofs/${imgName}?t=${Date.now()}`} 
                    alt="AI Proof" 
                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="mt-2 flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-500 truncate w-24">{imgName}</span>
                    <ImageIcon size={12} className="text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* --- END NEW SECTION --- */}

        </div>

        {/* RIGHT: Results Dashboard */}
        <div className="relative min-h-[500px]">
          {uploading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm p-8">
                <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Neural Processing...</h3>
                <p className="text-slate-400 font-mono text-sm animate-pulse">DETECTING_OBJECTS_V8</p>
             </div>
          ) : result ? (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
             >
                {/* 1. KEY STATS CARDS */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                        <BarChart size={80} />
                    </div>
                    <p className="text-cyan-500 text-xs font-mono font-bold tracking-widest uppercase mb-2">Total Count</p>
                    <p className="text-4xl font-black text-white">
                      {result?.stats?.totalVehicles || 0}
                    </p>
                  </div>
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden hover:border-violet-500/30 transition-colors">
                    <p className="text-violet-500 text-xs font-mono font-bold tracking-widest uppercase mb-2">Density Index</p>
                    <p className="text-4xl font-black text-white">
                      {result?.stats?.trafficDensity || "Low"}
                    </p>
                  </div>
                </div>

                {/* 2. RISK ALERTS */}
                <div className={`border p-5 rounded-2xl ${result?.riskEvents?.length > 0 ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                    {result?.riskEvents?.length > 0 ? (
                      <>
                        <div className="flex items-center gap-3 text-red-400 font-bold mb-3">
                          <ShieldAlert size={20} />
                          <span className="uppercase tracking-wide">Threat Detected ({result.riskEvents.length})</span>
                        </div>
                        <ul className="space-y-2">
                          {result.riskEvents.slice(0, 3).map((e, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-red-300/80 font-mono">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                {e}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle size={20} />
                            <span className="font-bold uppercase tracking-wide">Sector Clear</span>
                        </div>
                    )}
                </div>

                {/* 3. DISTRIBUTION CHART */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 font-bold text-white mb-6 uppercase text-sm tracking-wider">
                    <BarChart className="w-4 h-4 text-cyan-400" /> Class Distribution
                  </h3>
                  <div className="space-y-4">
                    {result?.stats?.vehicleDistribution && Object.entries(result.stats.vehicleDistribution).map(([key, value]) => (
                      key !== 'total' && (
                        <div key={key} className="flex items-center justify-between group">
                          <span className="capitalize text-slate-400 text-sm font-medium">{key}</span>
                          <div className="flex items-center gap-4 w-2/3">
                            <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: result.stats.totalVehicles > 0 ? `${(value / result.stats.totalVehicles) * 100}%` : '0%' }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${key === 'car' ? 'bg-cyan-500' : 'bg-violet-500'}`} 
                              />
                            </div>
                            <span className="font-mono text-sm font-bold text-white w-8 text-right">{value}</span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                {/* 4. RESULT PREVIEW */}
                <div className="rounded-2xl p-1 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden relative group shadow-2xl">
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-emerald-400 text-[10px] font-mono font-bold rounded border border-emerald-500/30 backdrop-blur-md z-10 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> LIVE_INFERENCE
                    </div>
                    
                    {result.isVideo ? (
                      <video 
                        controls 
                        autoPlay
                        muted
                        className="w-full h-auto rounded-xl grayscale-[20%] contrast-125"
                        src={`http://localhost:5000/results/${result.processedPath}`}
                      />
                    ) : (
                      <img 
                        src={`http://localhost:5000/results/${result.processedPath}`} 
                        alt="Processed result" 
                        className="w-full h-64 object-cover rounded-xl grayscale-[20%] contrast-125" 
                      />
                    )}
                </div>

             </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl min-h-[400px] bg-slate-900/30">
               <p className="font-mono text-sm">AWAITING_INPUT_STREAM...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;