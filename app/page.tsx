"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateHistoryAnalysis } from '@/lib/aiService';
import { Bot, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import MapBlock to avoid SSR issues with Mapbox
const MapBlock = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    </main>
  );
}
