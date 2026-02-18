import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronDown, ChevronUp, BookOpen, Clock, Info, ChevronRight } from 'lucide-react';

interface PlaceDetailsPanelProps {
    currentPlaceName: any;
    searchQuery: string;
    placeHistory: any[];
    selectedYear: number;
    onYearSelect: (year: number) => void;
    onClose: () => void;
    isOpen: boolean;
}

export default function PlaceDetailsPanel({
    currentPlaceName,
    searchQuery,
    placeHistory,
    selectedYear,
    onYearSelect,
    onClose,
    isOpen
}: PlaceDetailsPanelProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'etymology'>('overview');
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Capitalize modern name
    const displayModernName = searchQuery
        ? searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLocaleLowerCase()).join(' ')
        : '';

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile Backdrop (Bottom Sheet) */}
            <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={onClose} />

            <motion.div
                initial={{ x: '-100%', opacity: 0 }} // Desktop slide from left
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                className={`
          fixed z-50 bg-[var(--panel-bg-solid)] backdrop-blur-xl border-[var(--border-color)] shadow-2xl
          flex flex-col transition-all duration-300
          
          /* Desktop Styles */
          md:left-0 md:top-0 md:bottom-0 md:w-[400px] md:border-r md:rounded-none
          
          /* Mobile Styles (Bottom Sheet) */
          left-0 right-0 bottom-0 h-[65vh] rounded-t-2xl border-t
          md:h-auto
        `}
            >
                {/* Mobile Drag Handle */}
                <div className="md:hidden w-full flex justify-center pt-3 pb-1" onClick={() => activeTab === 'overview' ? setActiveTab('etymology') : setActiveTab('overview')}>
                    <div className="w-12 h-1.5 bg-[var(--border-color)] rounded-full hover:bg-[var(--text-muted)] transition-colors cursor-grab active:cursor-grabbing" />
                </div>

                {/* Header Section */}
                <div className="p-5 pb-2 flex-none border-b border-[var(--border-color)]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold mb-1 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                                Tarihsel Konum
                            </span>
                            <h2 className="text-3xl font-black text-[var(--text-primary)] leading-none tracking-tight">
                                {currentPlaceName?.name || displayModernName}
                            </h2>
                            {currentPlaceName?.name !== displayModernName && (
                                <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                    <span className="opacity-50">Modern:</span>
                                    <span className="font-medium">{displayModernName}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-[var(--surface-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-6 mt-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-2 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'overview'
                                    ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]'
                                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                                }`}
                        >
                            GENEL BAKIŞ
                        </button>
                        <button
                            onClick={() => setActiveTab('etymology')}
                            className={`pb-2 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'etymology'
                                    ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]'
                                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                                }`}
                        >
                            ETİMOLOJİ
                            <span className="ml-1.5 text-[10px] py-0.5 px-1.5 rounded-full bg-[var(--surface-bg)] text-[var(--text-muted)]">
                                {placeHistory.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">

                    {/* TAB: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Period Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent-primary)]/20">
                                <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                                <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                                    {currentPlaceName ? `${Math.abs(currentPlaceName.startYear)} ${currentPlaceName.startYear < 0 ? 'MÖ' : ''} - ${currentPlaceName.endYear}` : 'Dönem Bilinmiyor'}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="relative group">
                                <p className={`text-sm leading-7 text-[var(--text-secondary)] ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                                    {((currentPlaceName as any)?.description || (currentPlaceName as any)?.notes)
                                        ? `"${(currentPlaceName as any).description || (currentPlaceName as any).notes}"`
                                        : "Bu dönem için detaylı açıklama bulunmamaktadır."}
                                </p>
                                {/* Read More Button */}
                                {((currentPlaceName as any)?.description?.length > 150 || (currentPlaceName as any)?.notes?.length > 150) && (
                                    <button
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className="mt-1 text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5"
                                    >
                                        {isDescriptionExpanded ? 'Daha az göster' : 'Devamını oku'}
                                        {isDescriptionExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                )}
                            </div>

                            {/* Quick Facts / Metadata (Placeholder for future data) */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)]">
                                    <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Medeniyet</div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                                        {/* Infer civilization from year roughly or add to data later */}
                                        {Math.abs(selectedYear) < 1000 ? 'Antik Çağ' : (selectedYear < 1453 ? 'Orta Çağ' : 'Modern Dönem')}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)]">
                                    <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Kaynak Tipi</div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                                        Literatür / Arşiv
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: ETYMOLOGY (Vertical Timeline) */}
                    {activeTab === 'etymology' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative pl-2"
                        >
                            {/* Vertical Line */}
                            <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-[var(--border-color)]" />

                            <div className="space-y-6">
                                {placeHistory.map((entry, idx) => {
                                    const isCurrent = entry.name === currentPlaceName?.name;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                onYearSelect(entry.startYear);
                                            }}
                                            className={`relative pl-8 group cursor-pointer transition-all ${isCurrent ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                        >
                                            {/* Timeline Dot */}
                                            <div className={`
                        absolute left-0 top-1.5 w-4 h-4 rounded-full border-[3px] z-10 transition-all
                        ${isCurrent
                                                    ? 'bg-[var(--panel-bg)] border-[var(--accent-primary)] scale-110 shadow-[0_0_0_4px_var(--accent-glow)]'
                                                    : 'bg-[var(--border-color)] border-[var(--panel-bg)] group-hover:bg-[var(--text-secondary)]'}
                      `} />

                                            {/* Content Card */}
                                            <div className={`p-3 rounded-xl border transition-all ${isCurrent
                                                    ? 'bg-[var(--surface-bg)] border-[var(--accent-primary)]/50 shadow-sm'
                                                    : 'border-transparent hover:bg-[var(--surface-bg)] hover:border-[var(--border-color)]'
                                                }`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                                                        {Math.abs(entry.startYear)} {entry.startYear < 0 ? 'MÖ' : ''}
                                                    </span>
                                                    {entry.language && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] uppercase tracking-wide">
                                                            {entry.language}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`text-lg font-bold mb-1 ${isCurrent ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                                                    {entry.name}
                                                </h3>

                                                {entry.meaning && (
                                                    <p className="text-xs text-[var(--text-secondary)] italic mb-2">
                                                        "{entry.meaning}"
                                                    </p>
                                                )}

                                                {entry.source && (
                                                    <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                                                        <BookOpen size={10} />
                                                        <span className="truncate">{entry.source}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </>
    );
}
