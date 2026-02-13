"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateHistoryAnalysis } from '@/lib/aiService';
import { Bot, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/AuthModal';

// Dynamically import MapBlock to avoid SSR issues with Mapbox
const MapBlock = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'demographics' | 'sources'>('analysis');
  const [historyData, setHistoryData] = useState<any>(null); // To store loaded history.json
  const [selectedFeatureData, setSelectedFeatureData] = useState<any>(null);

  useEffect(() => {
    // Load history data for lookup
    fetch('/data/history.json')
      .then(res => res.json())
      .then(data => setHistoryData(data));
  }, []);

  // Timeline marks
  const timelineMarks = [
    { year: -209, label: 'M.Ö. 209' },
    { year: 552, label: '552' },
    { year: 1071, label: '1071' },
    { year: 1453, label: '1453' },
    { year: 1923, label: '1923' },
    { year: 2026, label: '2026' },
  ];

  const handleStateClick = async (stateName: string) => {
    setSelectedState(stateName);
    setAiPanelOpen(true);
    setAiAnalysis('');
    setIsAnalyzing(true);
    setActiveTab('analysis'); // Reset to analysis tab

    // Find feature data
    if (historyData) {
      const feature = historyData.features.find((f: any) => f.properties.name === stateName);
      setSelectedFeatureData(feature ? feature.properties : null);
    }

    try {
      const analysis = await generateHistoryAnalysis(stateName, selectedYear);
      setIsAnalyzing(false);

      // Typewriter effect
      let i = 0;
      const typeWriter = setInterval(() => {
        setAiAnalysis((prev) => analysis.substring(0, i));
        i++;
        if (i > analysis.length) clearInterval(typeWriter);
      }, 30);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setAiAnalysis("Analiz yapılamadı.");
    }
  };

  return (
    <main className="w-full h-screen relative bg-black overflow-hidden font-sans">
      {/* Map Layer */}
      <MapBlock selectedYear={selectedYear} onStateClick={handleStateClick} />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-40 flex items-center gap-3 pointer-events-none"
      >
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white tracking-wider font-orbitron">
            TURKIC <span className="text-cyan-400">ATLAS</span>
          </h1>
          <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">AI Powered History</span>
        </div>
      </motion.div>

      {/* Login Button Overlay */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/50 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] group"
        >
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
            Giriş Yap
          </span>
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* AI Intelligence Panel (Sidebar) */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 w-96 h-full bg-slate-900/90 backdrop-blur-md border-l border-slate-700 p-6 shadow-2xl z-50 text-white"
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Bot className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Anadolu Coğrafi Hafıza Arşivi
                </h2>
              </div>
              <button onClick={() => setAiPanelOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
                <X size={20} />
              </button>
            </div>

            {selectedState && (
              <div className="flex flex-col h-[calc(100%-80px)]">
                {/* Header Section */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedState}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyan-400 font-mono">{selectedYear} Dönemi</span>
                    <div className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-green-900/50">
                      <span className="text-green-400">●</span> Güven: {selectedFeatureData?.confidence_score || 95}%
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700 mb-4">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Analiz
                  </button>
                  <button
                    onClick={() => setActiveTab('demographics')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'demographics' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Demografi
                  </button>
                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'sources' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Kaynaklar
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 min-h-[200px]">
                    {activeTab === 'analysis' && (
                      isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 text-cyan-400">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150" />
                          </div>
                          <span className="text-xs font-mono animate-pulse">Akademik Kaynaklar Taranıyor (BOA, DLT)...</span>
                        </div>
                      ) : (
                        <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-serif">
                          <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                        </div>
                      )
                    )}

                    {activeTab === 'demographics' && (
                      <div className="space-y-4">
                        {selectedFeatureData?.demographics ? (
                          Object.entries(selectedFeatureData.demographics).map(([year, pop]: [string, any]) => (
                            <div key={year} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0">
                              <span className="text-cyan-400 font-mono text-sm">{year}</span>
                              <span className="text-slate-200 text-sm">{pop}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 text-sm italic text-center py-4">Bu dönem/bölge için doğrulanmış demografik veri bulunamadı.</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'sources' && (
                      <ul className="space-y-2">
                        {selectedFeatureData?.sources ? (
                          selectedFeatureData.sources.map((source: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-cyan-500">📚</span>
                              {source}
                            </li>
                          ))
                        ) : (
                          <div className="text-slate-500 text-sm italic text-center py-4">Kaynak listesi hazırlanıyor.</div>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                <span className="opacity-50">Powered by</span>
                <span className="font-semibold text-slate-400">Google Gemini Pro</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Control Panel */}
      {/* Timeline Control Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl z-40">
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-glow">
              {selectedYear < 0 ? `M.Ö. ${Math.abs(selectedYear)}` : selectedYear}
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">Seçili Dönem</span>
          </div>

          <div className="w-full relative h-10 px-2 mt-1">
            {/* Slider */}
            <input
              type="range"
              min="-1000"
              max="2026"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all z-20 relative"
            />

            {/* Marks - Using absolute positioning for correct alignment */}
            <div className="absolute top-4 left-2 right-2 h-4 pointer-events-none">
              {timelineMarks.map((mark) => {
                // Calculate percentage based on min -1000 and max 2026
                const min = -1000;
                const max = 2026;
                const range = max - min;
                const percent = ((mark.year - min) / range) * 100;

                return (
                  <div
                    key={mark.year}
                    className="absolute flex flex-col items-center top-0 transform -translate-x-1/2 cursor-pointer pointer-events-auto"
                    style={{ left: `${percent}%` }}
                    onClick={() => setSelectedYear(mark.year)}
                  >
                    <div className={`w-0.5 h-1.5 mb-1 ${Math.abs(selectedYear - mark.year) < 100 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                    <span className={`text-[10px] whitespace-nowrap ${Math.abs(selectedYear - mark.year) < 100 ? 'text-cyan-400 font-bold' : 'text-slate-600 hover:text-slate-400'}`}>
                      {mark.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}
