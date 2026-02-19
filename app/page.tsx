"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateHistoryAnalysis, getPlaceNameHistory, generateBattleAnalysis, generateDynastyInfo, PlaceNameEntry } from '@/lib/aiService';
import { HISTORICAL_CITIES } from '@/lib/historicalCityNames';
import { getStateData } from '@/lib/historicalStateData';

import { MapPin, Search, Calendar, ChevronLeft, ChevronRight, X, Play, Pause, FastForward, Rewind, Layers, Settings, Globe, Info, Sparkles, BookOpen, Users, ScrollText, Music, Volume2, VolumeX, Maximize2, Minimize2, Share2, Download, AlertCircle, LogIn, LogOut, UserCircle, Bot, Clock, Scroll, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import HistoryModePanel, { HistoricalEvent } from '@/components/HistoryModePanel';
import PlaceDetailsPanel from '@/components/PlaceDetailsPanel';
import HistoryEventCard from '@/components/HistoryEventCard';

import { supabase } from '@/lib/supabase';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

const MapBlock = dynamic(() => import('@/components/MapComponent'), { ssr: false });
import MapOverlay from '@/components/MapOverlay';
import DemographicsCharts from '@/components/DemographicsCharts';
import { findDistrict, GeoJSONCollection } from '@/lib/geoUtils';

const safeJSONParse = (input: string) => {
  if (!input) return null;

  // 1. Remove markdown code blocks
  let cleaned = input.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Remove leading/trailing quotes if it's a double-stringified JSON
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    try {
      cleaned = JSON.parse(cleaned);
    } catch (e) {
      // If unwrapping fails, proceed with original cleaned string
    }
  }

  // 3. Handle literal escaped characters (Common in AI responses)
  // This replaces literal "\n", "\t" with actual whitespace or removes them
  cleaned = cleaned.replace(/\\n/g, ' ').replace(/\\t/g, ' ').replace(/\\/g, '');


  try {
    // 4. Try direct parse
    return JSON.parse(cleaned);
  } catch (e) {
    // 5. Fallback: Extract JSON object if embedded in text
    try {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonCandidate);
      }
    } catch (e2) {
      // console.warn("Failed to parse JSON, returning null", e);
    }
    return null;
  }
};

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number, lng: number } | null>(null); // State for Map flyTo
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [relatedState, setRelatedState] = useState<string | null>(null); // For flags (e.g., Empire name when viewing a city)
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'demographics' | 'sources'>('analysis');
  const [historyData, setHistoryData] = useState<any>(null); // To store loaded history.json
  const [selectedFeatureData, setSelectedFeatureData] = useState<any>(null);
  const [districtsGeoJSON, setDistrictsGeoJSON] = useState<GeoJSONCollection | null>(null);

  // Place Name History State
  const [searchQuery, setSearchQuery] = useState('');
  const [placeHistory, setPlaceHistory] = useState<PlaceNameEntry[]>([]);
  const [currentPlaceName, setCurrentPlaceName] = useState<PlaceNameEntry | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);

  // History Mode State
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [turkicOnly, setTurkicOnly] = useState(false);
  const [showAncientSites, setShowAncientSites] = useState(true); // New state for Ancient Sites
  const [showCulturalHeritage, setShowCulturalHeritage] = useState(true);
  const [dynastyInfo, setDynastyInfo] = useState<string | null>(null);
  const [isLoadingDynasty, setIsLoadingDynasty] = useState(false);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/data/history.json')
      .then(res => {
        if (!res.ok) {
          console.warn('legacy history.json skipped');
          return { type: 'FeatureCollection', features: [] };
        }
        return res.json();
      })
      .then(data => setHistoryData(data))
      .catch(() => console.warn('history.json not available'));

    fetch('https://jmgvwoweldtdonvreesg.supabase.co/storage/v1/object/public/geodata/turkey-districts.json')
      .then(res => res.json())
      .then(data => setDistrictsGeoJSON(data))
      .catch(err => console.error("Failed to load districts:", err));

    // Listen to auth state changes
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setCurrentUser(session?.user || null);
      }).catch((err) => {
        if (err.name !== 'AbortError' && err.message !== 'signal is aborted without reason') {
          console.warn('Auth session check failed:', err);
        }
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user || null);
      });
      return () => subscription.unsubscribe();
    }
  }, []);



  // Fetch Historical Events from Supabase
  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('historical_events')
          .select('*')
          .order('year', { ascending: true })
          .abortSignal(controller.signal);

        if (error) {
          // Ignore abort errors
          if (!error.message.includes("AbortError")) {
            console.error('Error fetching historical events:', error.message);
          }
        } else {
          setHistoricalEvents(data || []);
          console.log(`📜 Loaded ${data?.length} historical events`);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Unexpected error fetching events:', err);
        }
      }
    };
    fetchEvents();

    return () => {
      controller.abort();
    };
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
          // --- Fallback: Check local HISTORICAL_CITIES ---
          const localCity = HISTORICAL_CITIES.find(c =>
            c.modernName.toLocaleLowerCase('tr').includes(searchQuery.toLocaleLowerCase('tr')) ||
            c.names.some(n => n.name.toLocaleLowerCase('tr').includes(searchQuery.toLocaleLowerCase('tr')))
          );

          if (localCity) {
            console.log("📍 Found in local HISTORICAL_CITIES:", localCity.modernName);
            setFocusedLocation({ lat: localCity.lat, lng: localCity.lng });
          } else {
            console.log("Place not found in DB or Local Data");
          }
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
    setRelatedState(null); // Reset related state
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
      const fullResponse = await generateHistoryAnalysis(stateName, selectedYear);
      setIsAnalyzing(false);

      // Parse XML Sections
      const analizMatch = fullResponse.match(/<ANALIZ>([\s\S]*?)<\/ANALIZ>/);
      const demografiMatch = fullResponse.match(/<DEMOGRAFI>([\s\S]*?)<\/DEMOGRAFI>/);
      const kaynaklarMatch = fullResponse.match(/<KAYNAKLAR>([\s\S]*?)<\/KAYNAKLAR>/);
      const devletMatch = fullResponse.match(/<DEVLET>([\s\S]*?)<\/DEVLET>/);

      const analizText = analizMatch ? analizMatch[1].trim() : fullResponse;
      const demografiText = demografiMatch ? demografiMatch[1].trim() : null;
      const kaynaklarText = kaynaklarMatch ? kaynaklarMatch[1].trim() : null;
      const devletText = devletMatch ? devletMatch[1].trim() : null;

      if (devletText && devletText !== 'Bilinmiyor') {
        setRelatedState(devletText);
      }

      // Process Demographics
      let demographicsData = safeJSONParse(demografiText || '');

      // Process Sources
      let sourcesList: string[] = [];
      if (kaynaklarText) {
        sourcesList = kaynaklarText.split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim());
      }

      // Update parsed data into state (merging with existing feature data)
      if (demographicsData || sourcesList.length > 0) {
        setSelectedFeatureData((prev: any) => ({
          ...prev,
          demographics: demographicsData || prev?.demographics,
          sources: sourcesList.length > 0 ? sourcesList : prev?.sources
        }));
      }

      // Typewriter effect for Analysis text
      const analysisToType = analizText;
      let i = 0;
      typingIntervalRef.current = setInterval(() => {
        setAiAnalysis((prev) => analysisToType.substring(0, i));
        i += 2;
        if (i > analysisToType.length) {
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
    console.log("Place clicked:", place);
    if (!place || !place.name) return;

    // Force close search mobile if open
    setMobileSearchOpen(false);

    // Open AI Panel with Place Info immediately
    setSelectedState(place.name); // Title of the panel
    setRelatedState(null); // Reset related state
    setAiPanelOpen(true);
    setAiAnalysis('');
    setIsAnalyzing(true);
    setActiveTab('analysis');

    // Create a safe data object
    const placeInfo = place.historical_data || {};

    // Set feature data for the panel
    setSelectedFeatureData({
      ...placeInfo,
      name: place.name,
      type: place.type,
      confidence_score: 95,
      // Ensure we preserve existing props if available
      demographics: placeInfo.demographics || place.demographics,
      sources: placeInfo.sources || place.sources
    });

    // Clear any existing typing interval
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    try {
      // ... existing logic ...
      // Fetch historical names (Etymology Dictionary) for this place
      if (place.name) {
        getPlaceNameHistory(place.name)
          .then(history => {
            setPlaceHistory(history);
            setCurrentPlaceName(history.find(h => h.startYear <= selectedYear && h.endYear >= selectedYear) || null);
          })
          .catch(err => console.error("Etymology fetch error:", err));
      }

      if (placeInfo.description) {
        // ... existing description handling ...
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
        // Trigger AI Analysis
        const lat = Number(place.lat || place.latitude);
        const lng = Number(place.lng || place.longitude);
        const location = (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : undefined;

        // ... district lookup ...
        let district: string | undefined;
        if (location && districtsGeoJSON) {
          const d = findDistrict(location.lat, location.lng, districtsGeoJSON);
          if (d) district = d;
        }

        // ... historical name logic ...
        let historicalName: string | undefined;
        if (currentPlaceName && place.name === searchQuery) {
          historicalName = currentPlaceName.name;
        } else if (place.etymology_chain || place.properties?.etymology_chain) {
          const chain = place.etymology_chain || place.properties?.etymology_chain;
          if (Array.isArray(chain)) {
            const match = chain.sort((a: any, b: any) => b.year - a.year).find((item: any) => item.year <= selectedYear);
            if (match) historicalName = match.name;
          }
        }

        const fullResponse = await generateHistoryAnalysis(place.name, selectedYear, location, district, historicalName);
        setIsAnalyzing(false);

        // ... parsing logic ...
        const analizMatch = fullResponse.match(/<ANALIZ>([\s\S]*?)<\/ANALIZ>/);
        const demografiMatch = fullResponse.match(/<DEMOGRAFI>([\s\S]*?)<\/DEMOGRAFI>/);
        const kaynaklarMatch = fullResponse.match(/<KAYNAKLAR>([\s\S]*?)<\/KAYNAKLAR>/);
        const devletMatch = fullResponse.match(/<DEVLET>([\s\S]*?)<\/DEVLET>/);

        const analizText = analizMatch ? analizMatch[1].trim() : fullResponse;
        const demografiText = demografiMatch ? demografiMatch[1].trim() : null;
        const kaynaklarText = kaynaklarMatch ? kaynaklarMatch[1].trim() : null;
        const devletText = devletMatch ? devletMatch[1].trim() : null;

        if (devletText && devletText !== 'Bilinmiyor') {
          setRelatedState(devletText);
        }

        let demographicsData = safeJSONParse(demografiText || '');
        let sourcesList: string[] = [];
        if (kaynaklarText) {
          sourcesList = kaynaklarText.split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
        }

        setSelectedFeatureData((prev: any) => ({
          ...prev,
          demographics: demographicsData || prev?.demographics,
          sources: sourcesList.length > 0 ? sourcesList : prev?.sources
        }));

        const analysisToType = analizText;
        let i = 0;
        typingIntervalRef.current = setInterval(() => {
          setAiAnalysis((prev) => analysisToType.substring(0, i));
          i += 2;
          if (i > analysisToType.length) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          }
        }, 10);
      }
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      setIsAnalyzing(false);
      setAiAnalysis("Bağlantı hatası veya veri işleme sorunu oluştu. Lütfen tekrar deneyin.\n\n" + (error?.message || ""));
    }
  };

  // History Mode: Event Click Handler
  const handleHistoricalEventClick = async (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setDynastyInfo(null);

    // Fly to event location
    setFocusedLocation({ lat: event.lat, lng: event.lng });

    // Auto-fetch dynasty info
    if (event.parties && event.parties.length > 0) {
      setIsLoadingDynasty(true);
      try {
        const info = await generateDynastyInfo(event.parties[0], event.year);
        setDynastyInfo(info);
      } catch (err) {
        console.error('Dynasty info error:', err);
      } finally {
        setIsLoadingDynasty(false);
      }
    }
  };

  // History Mode: AI Analyze Event
  const handleAnalyzeEvent = async (event: HistoricalEvent) => {
    setSelectedState(event.name);
    setAiPanelOpen(true);
    setAiAnalysis('');
    setIsAnalyzing(true);
    setActiveTab('analysis');
    setSelectedEvent(null);

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    try {
      const fullResponse = await generateBattleAnalysis(
        event.name, event.year, event.parties || [], event.result || ''
      );
      setIsAnalyzing(false);

      // Typewriter effect
      let i = 0;
      typingIntervalRef.current = setInterval(() => {
        setAiAnalysis(fullResponse.substring(0, i));
        i += 2;
        if (i > fullResponse.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        }
      }, 10);

      // Set feature data for demographics/sources tabs
      setSelectedFeatureData({
        name: event.name,
        type: event.type,
        sources: event.source ? [event.source] : [],
        confidence_score: event.importance === 'critical' ? 98 : 85
      });
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setAiAnalysis('Analiz yapılamadı.');
    }
  };

  // Filter toggle handler
  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <main className="w-full h-[100dvh] fixed inset-0 bg-[var(--background)] overflow-hidden font-sans">
      {/* Map Layer */}
      <MapBlock
        selectedYear={selectedYear}
        onStateClick={handleStateClick}
        onPlaceClick={handlePlaceClick}
        focusedLocation={focusedLocation}
        historyMode={isHistoryMode}
        historicalEvents={historicalEvents}
        onHistoricalEventClick={handleHistoricalEventClick}
        isAdmin={isAdmin}
        showAncientSites={showAncientSites}
        showCulturalHeritage={showCulturalHeritage}
      />
      {/* MapOverlay removed per user request */}

      {/* Responsive Header */}
      <header className="absolute top-0 left-0 w-full z-40 p-4 md:p-6 flex items-center justify-between pointer-events-none">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col pointer-events-auto"
        >
          <h1 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-wider font-orbitron">
            TURKIC <span className="text-[var(--accent-primary)]">ATLAS</span>
          </h1>
          <span className="text-[8px] md:text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase">AI Powered History</span>
        </motion.div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Search Bar */}
          <div className={`transition-all duration-300 ${mobileSearchOpen ? 'w-full absolute left-0 top-16 px-4' : 'relative'}`}>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden bg-[var(--panel-bg)] p-2 rounded-full text-[var(--text-muted)] border border-[var(--border-color)] backdrop-blur-md"
            >
              {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Search Input (Visible on Desktop OR when Mobile Toggled) */}
            <form
              onSubmit={handleCitySearch}
              className={`${mobileSearchOpen ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 relative group`}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${isSearching ? 'text-[var(--accent-primary)] animate-pulse' : 'text-[var(--text-muted)]'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Şehir veya bölge adı yazın..."
                className="w-full glass-panel text-[var(--text-primary)] text-sm rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)] shadow-lg"
              />
              {placeHistory.length > 0 && (
                <div className="absolute top-1 right-1 px-2 py-1.5 rounded-full text-[10px] bg-[var(--badge-bg)] text-[var(--accent-primary)] border border-[var(--border-color)]">
                  {placeHistory.length}
                </div>
              )}
            </form>
          </div>

          {/* Admin Login — only visible to admin email */}
          {currentUser?.email === 'bahadirhanceylan@gmail.com' && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 rounded-full transition-all backdrop-blur-md border ${isAdmin
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-[var(--panel-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              title={isAdmin ? 'Admin Çıkış' : 'Admin Modu'}
            >
              <KeyRound className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* User Auth Area */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 glass-panel rounded-full px-3 py-1.5">
                <UserCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)] max-w-[120px] truncate">
                  {currentUser.user_metadata?.username || currentUser.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={async () => {
                  if (supabase) await supabase.auth.signOut();
                  setCurrentUser(null);
                }}
                className="p-2 glass-panel hover:border-red-500/50 rounded-full transition-all text-[var(--text-muted)] hover:text-red-400"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="glass-panel glow-effect text-[var(--text-primary)] p-2 md:px-6 md:py-2.5 rounded-full transition-all hover:shadow-[0_0_15px_var(--accent-glow)] group flex items-center justify-center"
            >
              <LogIn className="block md:hidden w-5 h-5 text-[var(--accent-primary)]" />
              <span className="hidden md:block text-sm font-medium bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent group-hover:from-[var(--accent-primary)] group-hover:to-blue-400 transition-all">
                Giriş Yap
              </span>
            </button>
          )}

          {/* History Mode Toggle */}
          <button
            onClick={() => {
              setIsHistoryMode(!isHistoryMode);
              if (!isHistoryMode) {
                if (selectedYear > 1923) setSelectedYear(1071);
              } else {
                setSelectedYear(2026);
                setSelectedEvent(null);
              }
            }}
            className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-full transition-all flex items-center gap-1.5 md:gap-2 backdrop-blur-md border ${isHistoryMode
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-[var(--panel-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-amber-500/30 hover:text-amber-500'
              }`}
            title="Tarih Modu"
          >
            <Scroll className="w-3.5 h-3.5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium block whitespace-nowrap">
              Tarih Modu
            </span>
            {isHistoryMode && (
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 md:px-3 md:py-2.5 rounded-full transition-all flex items-center gap-2 backdrop-blur-md border bg-[var(--panel-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
            title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* AI Intelligence Panel (Sidebar) */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[320px] bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-5 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Bot className="text-[var(--accent-primary)]" size={24} />
                <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-blue-500 bg-clip-text text-transparent">
                  Anadolu Coğrafi Hafıza Arşivi
                </h2>
              </div>
              <button onClick={() => setAiPanelOpen(false)} className="hover:bg-[var(--surface-bg)] p-1 rounded transition-colors text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            {selectedState && (
              <div className="flex flex-col h-[calc(100%-80px)]">
                {/* Header Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const stateData = getStateData(relatedState || selectedState);
                      return stateData?.flagUrl ? (
                        <img
                          src={stateData.flagUrl}
                          alt={selectedState}
                          className="w-16 h-10 object-cover rounded shadow-md border border-[var(--border-color)]"
                        />
                      ) : null;
                    })()}
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">{selectedState}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--accent-primary)] font-mono">{selectedYear} Dönemi</span>
                    <div className="flex items-center gap-1 text-xs bg-[var(--surface-bg)] px-2 py-1 rounded border border-[var(--border-color)]">
                      <span className="text-green-500">●</span> <span className="text-[var(--text-secondary)]">Güven: {selectedFeatureData?.confidence_score || 95}%</span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border-color)] mb-4">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    Analiz
                  </button>
                  <button
                    onClick={() => setActiveTab('demographics')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'demographics' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    Demografi
                  </button>
                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${activeTab === 'sources' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    Kaynaklar
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)] min-h-[200px]">
                    {activeTab === 'analysis' && (
                      isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 text-[var(--accent-primary)]">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce delay-150" />
                          </div>
                          <span className="text-xs font-mono animate-pulse">Akademik Kaynaklar Taranıyor (BOA, DLT)...</span>
                        </div>
                      ) : (
                        <div className="text-[var(--text-secondary)] text-sm leading-relaxed space-y-4 font-serif">
                          <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                        </div>
                      )
                    )}

                    {activeTab === 'demographics' && (
                      <div className="space-y-4">
                        {selectedFeatureData?.demographics ? (
                          <DemographicsCharts data={selectedFeatureData.demographics} />
                        ) : (
                          <div className="text-[var(--text-muted)] text-sm italic text-center py-4">Bu dönem/bölge için doğrulanmış demografik veri bulunamadı.</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'sources' && (
                      <ul className="space-y-2">
                        {selectedFeatureData?.sources ? (
                          selectedFeatureData.sources.map((source: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                              <span className="text-[var(--accent-primary)]">📚</span>
                              {source}
                            </li>
                          ))
                        ) : (
                          <div className="text-[var(--text-muted)] text-sm italic text-center py-4">Kaynak listesi hazırlanıyor.</div>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <div className="text-xs text-[var(--text-muted)] text-center flex items-center justify-center gap-1">
                <span className="opacity-50">Powered by</span>
                <span className="font-semibold text-[var(--text-secondary)]">Google Gemini Pro</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Control Panel */}

      {/* Search Result / Historical Context Box (Refactored to Side Panel) */}
      <AnimatePresence>
        {(currentPlaceName || (searchQuery && placeHistory.length > 0)) && (
          <PlaceDetailsPanel
            isOpen={true}
            currentPlaceName={currentPlaceName}
            searchQuery={searchQuery}
            placeHistory={placeHistory}
            selectedYear={selectedYear}
            onYearSelect={(year) => {
              setSelectedYear(year);
              const target = placeHistory.find(h => h.startYear <= year && h.endYear >= year);
              if (target) setCurrentPlaceName(target);
            }}
            onClose={() => {
              setSearchQuery('');
              setPlaceHistory([]);
              setCurrentPlaceName(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* History Event Card (overlay, shown when event selected in history mode) */}
      <AnimatePresence>
        {isHistoryMode && selectedEvent && (
          <HistoryEventCard
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onAnalyze={handleAnalyzeEvent}
            dynastyInfo={dynastyInfo}
            isLoadingDynasty={isLoadingDynasty}
          />
        )}
      </AnimatePresence>

      {/* History Mode Panel (replaces normal timeline when active) */}
      <AnimatePresence>
        {isHistoryMode && (
          <HistoryModePanel
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            events={historicalEvents}
            onEventClick={handleHistoricalEventClick}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            turkicOnly={turkicOnly}
            onTurkicToggle={() => setTurkicOnly(!turkicOnly)}
            showAncientSites={showAncientSites}
            onAncientSitesToggle={() => setShowAncientSites(!showAncientSites)}
            showCulturalHeritage={showCulturalHeritage}
            onCulturalHeritageToggle={() => setShowCulturalHeritage(!showCulturalHeritage)}
          />
        )}
      </AnimatePresence>

      {/* Normal Timeline Control Panel - ONLY in Default Mode */}
      {
        !isHistoryMode && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 w-[90%] md:w-[60%] lg:w-[50%] max-w-4xl z-40"
          >
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">

              {/* Year Display */}
              <div className="flex flex-col items-start min-w-[80px]">
                <span className="text-xl font-bold text-white leading-none">
                  {selectedYear < 0 ? `M.Ö. ${Math.abs(selectedYear)}` : selectedYear}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Dönem</span>
              </div>

              {/* Slider Container */}
              <div className="relative flex-1 h-8 flex items-center">

                {/* Slider Track and Input */}
                <input
                  type="range"
                  min="-1000"
                  max="2026"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-yellow-400 z-20 relative history-timeline-slider"
                />

                {/* Marks (Tick Marks) */}
                <div className="absolute inset-x-0 h-full pointer-events-none">
                  {timelineMarks.map((mark) => {
                    const min = -1000;
                    const max = 2026;
                    const range = max - min;
                    const percent = ((mark.year - min) / range) * 100;
                    const near = Math.abs(selectedYear - mark.year) < 100;

                    return (
                      <div
                        key={mark.year}
                        className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
                        style={{ left: `${percent}%` }}
                        onClick={() => setSelectedYear(mark.year)}
                      >
                        <div className={`w-1 h-1 rounded-full mb-2 ${near ? 'bg-yellow-400 scale-150' : 'bg-slate-500 group-hover:bg-slate-300'} transition-all`} />
                        <span className={`absolute top-4 text-[9px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${near ? 'text-yellow-400 opacity-100' : 'text-slate-400'}`}>
                          {mark.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Dynamic History Markers (Search Results) */}
                  {placeHistory.map((entry, idx) => {
                    const min = -1000;
                    const max = 2026;
                    const range = max - min;
                    const percent = Math.max(0, Math.min(100, ((entry.startYear - min) / range) * 100));

                    return (
                      <div
                        key={`history-${idx}`}
                        className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
                        style={{ left: `${percent}%` }}
                        onClick={() => setSelectedYear(entry.startYear)}
                        title={`${entry.name} (${entry.startYear})`}
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </main >
  );
}
