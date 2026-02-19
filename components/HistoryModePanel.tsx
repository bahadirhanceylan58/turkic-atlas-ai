"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, ScrollText, Route, Globe2, ChevronLeft, ChevronRight, Landmark, Filter, BookOpen } from 'lucide-react';

export interface HistoricalEvent {
    id: number;
    name: string;
    type: 'battle' | 'treaty';
    year: number;
    lat: number;
    lng: number;
    description?: string;
    parties?: string[];
    result?: string;
    importance?: 'critical' | 'major' | 'minor';
    source?: string;
}

interface HistoryModePanelProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
    events: HistoricalEvent[];
    onEventClick: (event: HistoricalEvent) => void;
    activeFilters: string[];
    onFilterToggle: (filter: string) => void;
    turkicOnly: boolean;
    onTurkicToggle: () => void;
    showAncientSites?: boolean;
    onAncientSitesToggle?: () => void;
}

const TIMELINE_MIN = -1000;
const TIMELINE_MAX = 2026;

const HistoryModePanel: React.FC<HistoryModePanelProps> = ({
    selectedYear,
    onYearChange,
    events,
    onEventClick,
    activeFilters,
    onFilterToggle,
    turkicOnly,
    onTurkicToggle,
    showAncientSites = true,
    onAncientSitesToggle
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const visibleEvents = useMemo(() => {
        return events.filter(e => {
            if (activeFilters.length > 0 && !activeFilters.includes(e.type)) return false;
            return true;
        });
    }, [events, activeFilters]);

    const formatYear = (y: number) => y < 0 ? `M.Ö. ${Math.abs(y)}` : `${y}`;
    const yearToPercent = (year: number) => ((year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100;

    const jumpBackward = () => {
        const prev = visibleEvents
            .filter(e => e.year < selectedYear)
            .sort((a, b) => b.year - a.year)[0];
        if (prev) onYearChange(prev.year);
        else onYearChange(Math.max(TIMELINE_MIN, selectedYear - 100));
    };

    const jumpForward = () => {
        const next = visibleEvents
            .filter(e => e.year > selectedYear)
            .sort((a, b) => a.year - b.year)[0];
        if (next) onYearChange(next.year);
        else onYearChange(Math.min(TIMELINE_MAX, selectedYear + 100));
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] lg:w-[50%] max-w-4xl z-40 flex flex-col items-center gap-2"
        >
            {/* Filter Pill (Optional, floats above) */}
            {showFilters && (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl mb-2 animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-2">Filtreler:</span>
                    <button
                        onClick={onTurkicToggle}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${turkicOnly
                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                    >
                        <Globe2 size={12} className="inline mr-1" />
                        Türk Tarihi
                    </button>
                    {/* Ancient Sites Toggle */}
                    <button
                        onClick={onAncientSitesToggle}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${showAncientSites
                            ? 'bg-amber-600/20 border-amber-600 text-amber-500'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                    >
                        <Landmark size={12} className="inline mr-1" />
                        Antik Yerler
                    </button>
                    {[{ id: 'battle', label: 'Savaş', icon: Swords }, { id: 'treaty', label: 'Anlaşma', icon: ScrollText }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => onFilterToggle(t.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${activeFilters.length === 0 || activeFilters.includes(t.id)
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <t.icon size={12} className="inline mr-1" />
                            {t.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Control Bar */}
            <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-3 md:px-6 md:py-3 flex items-center gap-3 md:gap-4 shadow-2xl">

                {/* Left: Year & Navigation */}
                <div className="flex items-center gap-2 pl-1 md:pl-2 border-r border-slate-700 pr-3 md:pr-4">
                    <button
                        onClick={jumpBackward}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
                        title="Önceki Olay"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex flex-col items-center min-w-[60px] md:min-w-[70px]">
                        <span className="text-lg md:text-xl font-bold text-white leading-none tracking-tight">
                            {formatYear(selectedYear)}
                        </span>
                        <span className="text-[9px] text-yellow-500/80 font-mono font-bold uppercase tracking-widest mt-0.5">Tarih</span>
                    </div>

                    <button
                        onClick={jumpForward}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
                        title="Sonraki Olay"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Center: Slider */}
                <div className="flex-1 relative h-8 md:h-10 flex items-center px-1 md:px-2 group">
                    <input
                        type="range"
                        min={TIMELINE_MIN}
                        max={TIMELINE_MAX}
                        value={selectedYear}
                        onChange={(e) => onYearChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-yellow-400 z-20 relative history-timeline-slider"
                    />

                    {/* Event Markers on Track */}
                    <div className="absolute inset-x-2 top-0 h-full pointer-events-none">
                        {visibleEvents.map(event => {
                            const left = yearToPercent(event.year);
                            if (left < 0 || left > 100) return null;
                            const isBattle = event.type === 'battle';
                            const isNear = Math.abs(event.year - selectedYear) < 20;

                            return (
                                <div
                                    key={event.id}
                                    className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10 transition-all duration-300 pointer-events-auto cursor-pointer
                                        ${isNear ? 'bg-yellow-400 scale-150 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : (isBattle ? 'bg-red-500/60' : 'bg-green-500/60')}
                                        group-hover:opacity-100 opacity-60 hover:scale-150
                                     `}
                                    style={{ left: `${left}%` }}
                                    onClick={() => onYearChange(event.year)}
                                    title={`${event.name} (${event.year})`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right: Toggle Filters */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-yellow-400 text-black' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                    title="Filtreleri Göster"
                >
                    <Filter size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default HistoryModePanel;
