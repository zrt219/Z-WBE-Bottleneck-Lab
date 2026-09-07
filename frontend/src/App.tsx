import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { SimulatorPage } from './pages/SimulatorPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';
import { InteractiveTour } from './components/InteractiveTour';
import { Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [hasInterpretation, setHasInterpretation] = useState(false);

  useEffect(() => {
    const handleStartTourEvent = () => setIsTourOpen(true);
    window.addEventListener('zwbe:start-tour', handleStartTourEvent);
    return () => window.removeEventListener('zwbe:start-tour', handleStartTourEvent);
  }, []);

  const handleTriggerApiCall = async () => {
    setIsApiLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: 'drosophila' })
      });
      if (res.ok) {
        setHasInterpretation(true);
      }
    } catch {
      // Fallback handled gracefully
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 bg-scientific-grid selection:bg-blue-100 selection:text-blue-900">
      <Header onStartTutorial={() => setIsTourOpen(true)} />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Routes>
          <Route path="/" element={<SimulatorPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onTriggerApiCall={handleTriggerApiCall}
        isApiLoading={isApiLoading}
        hasInterpretation={hasInterpretation}
      />

      <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">
              Z-WBE Bottleneck Lab
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Google Cloud × NVIDIA GTC Berlin 2026
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-y-1.5 gap-x-2 text-[11px]">
            <span className="flex items-center space-x-1 text-slate-600">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>NVIDIA Nemotron 3 Super</span>
            </span>
            <span className="text-slate-300">×</span>
            <span className="flex items-center space-x-1 text-slate-600">
              <Cpu className="w-3 h-3 text-blue-600" />
              <span>OpenRouter</span>
            </span>
            <span className="text-slate-300">×</span>
            <span className="flex items-center space-x-1 text-slate-600">
              <ShieldCheck className="w-3 h-3 text-indigo-600" />
              <span>Zero-Hallucination Contract</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

