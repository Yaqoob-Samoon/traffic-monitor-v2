import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import UploadPage from './pages/Upload';
import LiveFeed from './pages/LiveFeed';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-cyan-500/30">
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/live" element={<LiveFeed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Layout>
        </Router>
    </div>
  );
}

export default App;