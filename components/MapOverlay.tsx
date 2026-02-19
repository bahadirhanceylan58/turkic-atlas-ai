"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapOverlayProps {
    isVisible: boolean;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 pointer-events-none z-[1]"
                >
                    {/* 1. Base Sepia/Color Filter for the Map below */}
                    <div className="absolute inset-0 bg-[#f4e4bc] mix-blend-color pointer-events-none opacity-40" />

                    {/* 2. Parchment Texture / Noise */}
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                        }}
                    />

                    {/* 3. Vignette (Dark edges) */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(60,40,20,0.4) 100%)'
                        }}
                    />

                    {/* 4. Fine Grain Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MapOverlay;
