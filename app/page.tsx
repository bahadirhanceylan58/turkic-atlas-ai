"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateHistoryAnalysis, getPlaceNameHistory, PlaceNameEntry } from '@/lib/aiService';
import { Bot, ChevronRight, X, Search, MapPin, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/AuthModal';

import { supabase } from '@/lib/supabase'; // Import Supabase Client

// Dynamically import MapBlock to avoid SSR issues with Mapbox
const MapBlock = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number, lng: number } | null>(null); // State for Map flyTo
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'demographics' | 'sources'>('analysis');
  const [historyData, setHistoryData] = useState<any>(null); // To store loaded history.json
  const [selectedFeatureData, setSelectedFeatureData] = useState<any>(null);

  // Place Name History State
  const [searchQuery, setSearchQuery] = useState('');
  const [placeHistory, setPlaceHistory] = useState<PlaceNameEntry[]>([]);
  const [currentPlaceName, setCurrentPlaceName] = useState<PlaceNameEntry | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // Mobile search toggle state
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false); // New state for Left Info Box visibility

  useEffect(() => {
    // Load history data for lookup
    fetch('/data/history.json')
      .then(res => res.json())
      .then(data => setHistoryData(data));
  }, []);

  // Update current place name based on timeline
  useEffect(() => {
    if (placeHistory.length > 0) {
      const entry = placeHistory.find(p => selectedYear >= p.startYear && selectedYear <= p.endYear);
      if (entry) {
        setCurrentPlaceName(entry);
      } else {
        // Fallback to closest or original if out of range
        setCurrentPlaceName(null);
      }
    }
  }, [selectedYear, placeHistory]);

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiPanelOpen(false); // Close other panel to focus on result
    try {
      const history = await getPlaceNameHistory(searchQuery);
      setPlaceHistory(history);
      setIsInfoBoxOpen(true); // Open the info box on successful search
      if (history.length > 0) {
        // Set initial view to matched year
        const entry = history.find(p => selectedYear >= p.startYear && selectedYear <= p.endYear);
        setCurrentPlaceName(entry || history[0]);

        // --- NEW: Go to location on map if possible ---
        // Try to find ANY place in DB that matches the search query (roughly)
        // We import supabase client and query 'places' table.
        // Assuming 'name' or 'current_label' logic.
        let placeData = null;

        if (supabase) {
          const { data, error } = await supabase
            .from('places')
            .select('lat, lng') // select minimal needed
            .ilike('name', `%${searchQuery}%`)
            .limit(1)
            .maybeSingle();

          if (error) {
            console.error("Supabase search error:", error);
          } else {
            placeData = data;
          }
        }

        if (placeData) {
          let lat = Number(placeData.lat);
          let lng = Number(placeData.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            setFocusedLocation({ lat, lng });
          }
        } else {
          // Optional: Show "Not found" toast or alert
          console.log("Place not found in DB");
          // alert("Yer bulunamadı!"); // Uncomment if you want a popup
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Timeline marks
  const timelineMarks = [
    { year: -209, label: 'M.Ö. 209' },
    { year: 552, label: '552' },
    { year: 1071, label: '1071' },
    { year: 1453, label: '1453' },
    { year: 1923, label: '1923' },
    { year: 2026, label: '2026' },
  ];

  // Ref for typing interval
  const typingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  const handleStateClick = async (stateName: string) => {
    setSelectedState(stateName);
    setAiPanelOpen(true);
    setAiAnalysis('');
    setIsAnalyzing(true);
    setActiveTab('analysis'); // Reset to analysis tab

    // Clear any existing typing interval
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

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
      // Faster typing (10ms) and safer interval handling
      typingIntervalRef.current = setInterval(() => {
        setAiAnalysis((prev) => analysis.substring(0, i));
        i += 2; // Type 2 chars at a time for speed
        if (i > analysis.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        }
      }, 10);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setAiAnalysis("Analiz yapılamadı.");
    }
  };

  const handlePlaceClick = async (place: any) => {
    // Open AI Panel with Place Info
    setSelectedState(place.name); // Title of the panel

    // Determine data source (Supabase 'historical_data' or place properties)
    const placeInfo = place.historical_data || {};

    // Set feature data for the panel (reusing structure for display)
    setSelectedFeatureData({
      ...placeInfo,
      name: place.name,
      type: place.type,
      confidence_score: 95
    });

    setAiPanelOpen(true);
    setAiAnalysis('');
    setIsAnalyzing(true);
    setActiveTab('analysis');

    // Clear any existing typing interval
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    // Generate Analysis or use Description
    try {
      if (placeInfo.description) {
        // Typewriter effect for existing description
        const analysis = placeInfo.description;
        let i = 0;
        typingIntervalRef.current = setInterval(() => {
          setAiAnalysis((prev) => analysis.substring(0, i));
          i += 2;
          if (i > analysis.length) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          }
        }, 10);
        setIsAnalyzing(false);
      } else {
        // Trigger AI Analysis for this place
        const analysis = await generateHistoryAnalysis(place.name, selectedYear);
        setIsAnalyzing(false);

        // Typewriter effect
        let i = 0;
        typingIntervalRef.current = setInterval(() => {
          setAiAnalysis((prev) => analysis.substring(0, i));
          i += 2;
          if (i > analysis.length) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          }
        }, 10);
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setAiAnalysis("Bu yer için detaylı analiz henüz oluşturulamadı.");
    }
  };

  return (
    <main className="w-full h-screen relative bg-black overflow-hidden font-sans">
      {/* Map Layer */}
      <MapBlock
        selectedYear={selectedYear}
        onStateClick={handleStateClick}
        onPlaceClick={handlePlaceClick}
        focusedLocation={focusedLocation}
      />

      {/* Responsive Header */}
      <header className="absolute top-0 left-0 w-full z-40 p-4 md:p-6 flex items-center justify-between pointer-events-none">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col pointer-events-auto"
        >
          <h1 className="text-lg md:text-xl font-bold text-white tracking-wider font-orbitron">
            TURKIC <span className="text-cyan-400">ATLAS</span>
          </h1>
          <span className="text-[8px] md:text-[10px] text-slate-400 tracking-[0.2em] uppercase">AI Powered History</span>
        </motion.div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Search Bar */}
          <div className={`transition-all duration-300 ${mobileSearchOpen ? 'w-full absolute left-0 top-16 px-4' : 'relative'}`}>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden bg-slate-900/80 p-2 rounded-full text-slate-400 border border-slate-700 backdrop-blur-md"
            >
              {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Search Input (Visible on Desktop OR when Mobile Toggled) */}
            <form
              onSubmit={handleCitySearch}
              className={`${mobileSearchOpen ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 relative group`}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${isSearching ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Şehir veya bölge adı yazın..."
                className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-sm rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500 shadow-lg"
              />
              {placeHistory.length > 0 && (
                <div className="absolute top-1 right-1 px-2 py-1.5 rounded-full text-[10px] bg-slate-800 text-cyan-400 border border-slate-700">
                  {placeHistory.length}
                </div>
              )}
            </form>
          </div>

          {/* Login Button/Icon */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/50 text-white p-2 md:px-6 md:py-2.5 rounded-full transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] group flex items-center justify-center"
          >
            {/* Mobile Icon */}
            <LogIn className="block md:hidden w-5 h-5 text-cyan-400" />

            {/* Desktop Text */}
            <span className="hidden md:block text-sm font-medium bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
              Giriş Yap
            </span>
          </button>
        </div>
      </header>

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
      {/* Search Result / Historical Context Box (Left Side) */}
      <AnimatePresence>
        {(currentPlaceName || (searchQuery && placeHistory.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute top-24 left-4 md:left-6 z-30 w-64 md:w-80"
          >
            <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group">

              {/* Decorative Background Elements */}
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/30 transition-all duration-500" />
              <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-blue-600/20 rounded-full blur-xl group-hover:bg-blue-600/30 transition-all duration-500" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                    <MapPin className="text-cyan-400 w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Tarihsel İsim</span>
                </div>

                {/* Main Name (Historical) */}
                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
                  {currentPlaceName?.name || searchQuery}
                </h2>

                {/* Subtitle (Modern Name if different) */}
                {currentPlaceName && currentPlaceName.name !== searchQuery && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <span>Modern: <span className="text-slate-200 font-medium">{searchQuery}</span></span>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent my-3" />

                {/* Context Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Dönem:</span>
                    <span className="text-cyan-300 font-mono font-medium">
                      {currentPlaceName ? `${Math.abs(currentPlaceName.startYear)} ${currentPlaceName.startYear < 0 ? 'M.Ö.' : ''} - ${currentPlaceName.endYear}` : 'Bilinmeyen'}
                    </span>
                  </div>

                  {/* Description snippet if available (using notes as fallback) */}
                  {(currentPlaceName?.description || currentPlaceName?.notes) && (
                    <p className="text-xs text-slate-300 italic mt-2 line-clamp-3">
                      "{currentPlaceName.description || currentPlaceName.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* Dynamic History Markers */}
              {placeHistory.map((entry, idx) => {
                const min = -1000;
                const max = 2026;
                const range = max - min;
                // Clamp percentage between 0 and 100
                const percent = Math.max(0, Math.min(100, ((entry.startYear - min) / range) * 100));
                const isActive = selectedYear >= entry.startYear && selectedYear <= entry.endYear;

                return (
                  <div
                    key={`history-${idx}`}
                    className="absolute top-[-12px] transform -translate-x-1/2 cursor-pointer group z-30"
                    style={{ left: `${percent}%` }}
                    onClick={() => setSelectedYear(entry.startYear)}
                  >
                    {/* Marker Dot */}
                    <div className={`w-2 h-2 rounded-full border border-slate-900 transition-all ${isActive ? 'bg-cyan-400 scale-150 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-500 hover:bg-cyan-300'}`} />

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-600">
                      {entry.name} ({entry.startYear})
                    </div>
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
