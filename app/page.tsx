"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateHistoryAnalysis } from '@/lib/aiService';
import { Bot, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import MapBlock to avoid SSR issues with Mapbox
const MapBlock = dynamic(() => import('@/components/MapBlock'), { ssr: false });

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Timeline marks
  const timelineMarks = [
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

      {/* AI Intelligence Panel (Sidebar) */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 w-96 h-full bg-slate-900/90 backdrop-blur-md border-l border-slate-700 p-6 shadow-2xl z-50 text-white"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Bot className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Intelligence
                </h2>
              </div>
              <button onClick={() => setAiPanelOpen(false)} className="hover:bg-slate-700 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {selectedState && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{selectedState}</h3>
                <div className="text-sm text-slate-400 mb-4">{selectedYear} Dönemi</div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 min-h-[150px]">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150" />
                      Analyzing Geopolitics...
                    </div>
                  ) : (
                    <p className="text-slate-300 leading-relaxed font-mono text-sm">
                      {aiAnalysis}
                      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle" />
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-auto absolute bottom-6 left-6 right-6">
              <div className="text-xs text-slate-500 text-center">
                Powered by Google Vertex AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Control Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-40">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 drop-shadow-glow">
            {selectedYear}
          </div>
          <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">Selected Period</div>

          <div className="w-full relative px-4">
            <input
              type="range"
              min="500"
              max="2026"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
            <div className="flex justify-between mt-2 px-1">
              {timelineMarks.map((mark) => (
                <div key={mark.year} className="flex flex-col items-center cursor-pointer group" onClick={() => setSelectedYear(mark.year)}>
                  <div className={`w-1 h-2 mb-1 ${Math.abs(selectedYear - mark.year) < 50 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  <span className={`text-xs ${Math.abs(selectedYear - mark.year) < 50 ? 'text-cyan-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {mark.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
