"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, LayoutDashboard, Database, ArrowLeft } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const ADMIN_EMAIL = 'bahadirhanceylan@gmail.com';

    useEffect(() => {
        const checkAuth = async () => {
            if (!supabase) return;

            const { data: { session } } = await supabase.auth.getSession();

            if (!session || session.user.email !== ADMIN_EMAIL) {
                router.replace('/');
            } else {
                setIsAuthorized(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[var(--background)] text-[var(--accent-primary)]">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[var(--background)] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--panel-bg)] flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-wider">
                        TURKIC <span className="text-[var(--accent-primary)]">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Yönetim
                    </div>
                    <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--border-color)]">
                        <LayoutDashboard size={20} className="text-[var(--accent-primary)]" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors w-full px-4 py-2"
                    >
                        <ArrowLeft size={16} />
                        <span>Siteye Dön</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
