"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ScrollText, Route, Globe2, Filter, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';

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
}

const ERAS = [
    { name: 'Antik', startYear: -1000, endYear: 476, color: '#8D6E63' },
    { name: 'Göktürk', startYear: 552, endYear: 744, color: '#627BC1' },
    { name: 'Selçuklu', startYear: 1037, endYear: 1307, color: '#1976D2' },
    { name: 'Osmanlı', startYear: 1299, endYear: 1922, color: '#388E3C' },
    { name: 'Cumhuriyet', startYear: 1923, endYear: 2026, color: '#E53935' },
];

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
    onTurkicToggle
}) => {

    const categories = [
        { id: 'battle', label: 'Savaşlar', icon: Swords, color: '#EF4444' },
        { id: 'treaty', label: 'Anlaşmalar', icon: ScrollText, color: '#22C55E' },
        { id: 'trade_route', label: 'Ticaret Yolları', icon: Route, color: '#FFD700' },
        { id: 'state', label: 'Devletler', icon: Landmark, color: '#627BC1' },
    ];

    const visibleEvents = useMemo(() => {
        return events.filter(e => {
            if (activeFilters.length > 0 && !activeFilters.includes(e.type)) return false;
            return true;
        });
    }, [events, activeFilters]);

    const nearbyEvents = useMemo(() => {
        return visibleEvents
            .map(e => ({ ...e, distance: Math.abs(e.year - selectedYear) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 6);
    }, [visibleEvents, selectedYear]);

    const yearToPercent = (year: number) => {
        return ((year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100;
    };

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

    const formatYear = (y: number) => y < 0 ? `M.Ö. ${Math.abs(y)}` : `${y}`;

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-40 pb-2 px-2 md:px-4 md:pb-4"
        >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.1)] overflow-hidden max-w-5xl mx-auto">

                {/* Row 1: Year Display (always full width, centered) */}
                <div className="flex items-center justify-center gap-3 px-3 py-1.5 border-b border-slate-700/30">
                    <button onClick={jumpBackward} className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors active:scale-90">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center min-w-[100px]">
                        <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            {formatYear(selectedYear)}
                        </span>
                    </div>
                    <button onClick={jumpForward} className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors active:scale-90">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Row 2: Filters (scrollable on mobile) */}
                <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-700/30 overflow-x-auto scrollbar-hide">
                    <Filter size={12} className="text-slate-500 flex-shrink-0" />
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeFilters.length === 0 || activeFilters.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterToggle(cat.id)}
                                className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-[11px] font-medium transition-all border ${isActive
                                    ? 'bg-slate-800 border-slate-600 text-white'
                                    : 'bg-transparent border-transparent text-slate-500'
                                    }`}
                            >
                                <Icon size={11} style={{ color: isActive ? cat.color : undefined }} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}

                    <div className="w-px h-4 bg-slate-700 mx-0.5 flex-shrink-0" />

                    <button
                        onClick={onTurkicToggle}
                        className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-[11px] font-medium transition-all border ${turkicOnly
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                            : 'bg-transparent border-transparent text-slate-500'
                            }`}
                    >
                        <Globe2 size={11} />
                        <span>Türk</span>
                    </button>
                </div>

                {/* Row 3: Timeline */}
                <div className="relative px-3 py-2">
                    {/* Era Bars */}
                    <div className="absolute inset-x-3 top-2 h-5 rounded overflow-hidden">
                        {ERAS.map(era => {
                            const left = yearToPercent(era.startYear);
                            const width = yearToPercent(era.endYear) - left;
                            return (
                                <div
                                    key={era.name}
                                    className="absolute top-0 h-full opacity-15 rounded"
                                    style={{
                                        left: `${Math.max(0, left)}%`,
                                        width: `${Math.min(100 - Math.max(0, left), width)}%`,
                                        backgroundColor: era.color
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={TIMELINE_MIN}
                        max={TIMELINE_MAX}
                        value={selectedYear}
                        onChange={(e) => onYearChange(parseInt(e.target.value))}
                        className="w-full h-5 appearance-none cursor-pointer relative z-10 history-timeline-slider"
                    />

                    {/* Event Markers */}
                    <div className="absolute inset-x-3 top-2 h-5 pointer-events-none z-20">
                        {visibleEvents.map(event => {
                            const left = yearToPercent(event.year);
                            if (left < 0 || left > 100) return null;
                            const isBattle = event.type === 'battle';
                            const isNear = Math.abs(event.year - selectedYear) < 30;
                            return (
                                <div
                                    key={event.id}
                                    className="absolute top-0 w-1 h-full rounded-full pointer-events-auto cursor-pointer transition-all hover:scale-125"
                                    style={{
                                        left: `${left}%`,
                                        backgroundColor: isBattle ? '#EF4444' : '#22C55E',
                                        opacity: event.importance === 'critical' ? 1 : 0.6,
                                        transform: `translateX(-50%) ${isNear ? 'scaleX(2) scaleY(1.3)' : ''}`
                                    }}
                                    title={`${event.name} (${event.year})`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                        onYearChange(event.year);
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Era Labels */}
                    <div className="flex justify-between mt-0.5">
                        {ERAS.map(era => {
                            const isActive = selectedYear >= era.startYear && selectedYear <= era.endYear;
                            return (
                                <button
                                    key={era.name}
                                    onClick={() => onYearChange(Math.floor((era.startYear + era.endYear) / 2))}
                                    className={`text-[8px] md:text-[9px] font-bold tracking-wider uppercase transition-all ${isActive ? 'text-amber-400' : 'text-slate-600'
                                        }`}
                                >
                                    {era.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Row 4: Nearby Events */}
                {nearbyEvents.length > 0 && (
                    <div className="border-t border-slate-700/30">
                        <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto scrollbar-hide">
                            {nearbyEvents.map(event => (
                                <button
                                    key={event.id}
                                    onClick={() => {
                                        onEventClick(event);
                                        onYearChange(event.year);
                                    }}
                                    className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-medium transition-all border ${event.year === selectedYear
                                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300'
                                        }`}
                                >
                                    <span className="text-[10px]">{event.type === 'battle' ? '⚔️' : '📜'}</span>
                                    <span className="whitespace-nowrap max-w-[120px] truncate">{event.name}</span>
                                    <span className="text-[9px] text-slate-500 font-mono">{event.year < 0 ? `M.Ö.${Math.abs(event.year)}` : event.year}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default HistoryModePanel;
