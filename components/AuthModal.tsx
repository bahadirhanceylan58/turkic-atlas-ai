import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                    {/* Header & Tabs */}
                    <div className="flex flex-col border-b border-slate-700/50">
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                {activeTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                            </h2>
                            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'login' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                Giriş
                                {activeTab === 'login' && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'register' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                Kayıt Ol
                                {activeTab === 'register' && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                            {activeTab === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 ml-1">Kullanıcı Adı</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                            placeholder="kagan_1453"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1">E-posta</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                        placeholder="ornek@turkic-atlas.ai"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
                                {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                                <ArrowRight size={18} />
                            </button>

                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                Devam ederek <span className="text-cyan-400 cursor-pointer hover:underline">Hizmet Şartları</span>'nı kabul etmiş olursunuz.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
