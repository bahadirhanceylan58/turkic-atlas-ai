"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Bot, BookOpen, Swords, ScrollText, Crown } from 'lucide-react';
import type { HistoricalEvent } from './HistoryModePanel';

interface HistoryEventCardProps {
    event: HistoricalEvent;
    onClose: () => void;
    onAnalyze: (event: HistoricalEvent) => void;
    dynastyInfo?: string | null;
    isLoadingDynasty?: boolean;
}

const HistoryEventCard: React.FC<HistoryEventCardProps> = ({
    event,
    onClose,
    onAnalyze,
    dynastyInfo,
    isLoadingDynasty
}) => {
    const isBattle = event.type === 'battle';

    const importanceColors = {
        critical: 'from-red-500/20 to-orange-500/20 border-red-500/30',
        major: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
        minor: 'from-slate-500/20 to-slate-400/20 border-slate-500/30'
    };

    const importanceLabels = {
        critical: 'Kritik Olay',
        major: 'Önemli Olay',
        minor: 'Yerel Olay'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-20 left-2 right-2 md:left-6 md:right-auto md:w-96 z-50 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-160px)]"
        >
            <div className={`bg-gradient-to-br ${importanceColors[event.importance || 'major']} bg-slate-900/95 backdrop-blur-xl border rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[inherit]`}>

                {/* Colored Stripe */}
                <div className={`h-1 w-full flex-shrink-0 ${isBattle ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} />

                {/* Fixed Header */}
                <div className="flex items-start justify-between px-4 pt-3 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isBattle ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                            {isBattle ? <Swords className="text-red-400" size={16} /> : <ScrollText className="text-green-400" size={16} />}
                        </div>
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isBattle ? 'text-red-400' : 'text-green-400'}`}>
                                {isBattle ? 'MUHAREBE' : 'ANTLAŞMA'}
                            </span>
                            {event.importance && (
                                <span className="text-[9px] text-slate-500 ml-1.5">
                                    • {importanceLabels[event.importance]}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-all">
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto px-4 pb-4 flex-1 min-h-0 custom-scrollbar">
                    {/* Event Name */}
                    <h3 className="text-lg md:text-xl font-black text-white mb-1 tracking-tight leading-tight">
                        {event.name}
                    </h3>

                    {/* Year & Location */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-amber-400 font-mono font-bold text-sm">
                            {event.year < 0 ? `M.Ö. ${Math.abs(event.year)}` : event.year}
                        </span>
                        <span className="text-[10px] text-slate-500">
                            {event.lat.toFixed(2)}°N, {event.lng.toFixed(2)}°E
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-slate-700 via-slate-600 to-transparent mb-3" />

                    {/* Parties */}
                    {event.parties && event.parties.length >= 2 && (
                        <div className="flex items-center justify-center gap-3 mb-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <span className="text-sm font-semibold text-blue-300">{event.parties[0]}</span>
                            <span className="text-amber-500 text-xs font-bold">VS</span>
                            <span className="text-sm font-semibold text-red-300">{event.parties[1]}</span>
                        </div>
                    )}

                    {/* Result */}
                    {event.result && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-slate-800/30 rounded-lg">
                            <Crown size={14} className="text-amber-400 flex-shrink-0" />
                            <span className="text-sm text-slate-200">{event.result}</span>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3 font-serif italic">
                            &ldquo;{event.description}&rdquo;
                        </p>
                    )}

                    {/* Source */}
                    {event.source && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-3">
                            <BookOpen size={10} />
                            <span>{event.source}</span>
                        </div>
                    )}

                    {/* Dynasty Info */}
                    {(dynastyInfo || isLoadingDynasty) && (
                        <div className="mb-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Crown size={12} className="text-amber-400" />
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Hanedan</span>
                            </div>
                            {isLoadingDynasty ? (
                                <div className="flex gap-1 py-2">
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                            ) : (
                                <p className="text-xs text-slate-300 whitespace-pre-wrap">{dynastyInfo}</p>
                            )}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={() => onAnalyze(event)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all active:scale-95"
                    >
                        <Bot size={14} />
                        AI Analizi
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default HistoryEventCard;
