"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Loader2, MapPin, Swords } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import PlaceForm from '@/components/admin/PlaceForm';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'events' | 'places'>('events');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal / Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    const fetchData = async () => {
        if (!supabase) return;
        setLoading(true);

        try {
            let query;
            if (activeTab === 'events') {
                query = supabase.from('historical_events').select('*').order('year', { ascending: true });
            } else {
                query = supabase.from('place_name_history').select('*').order('start_year', { ascending: true });
            }

            const { data: result, error } = await query;
            if (error) throw error;
            setData(result || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDelete = async (id: number) => {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
        if (!supabase) return;

        try {
            const table = activeTab === 'events' ? 'historical_events' : 'place_name_history';
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            fetchData(); // Refresh
        } catch (err: any) {
            alert('Silme hatası: ' + err.message);
        }
    };

    const openEdit = (item: any) => {
        setEditItem(item);
        setIsEditing(true);
    };

    const openNew = () => {
        setEditItem(null);
        setIsEditing(true);
    };

    const handleFormSuccess = () => {
        setIsEditing(false);
        setEditItem(null);
        fetchData();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    {activeTab === 'events' ? 'Tarihsel Olaylar' : 'Yer İsimleri'}
                </h2>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={18} />
                    <span>Yeni Ekle</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[var(--border-color)]">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-3 px-1 flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'events' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                    <Swords size={18} />
                    <span>Savaşlar & Antlaşmalar</span>
                </button>
                <button
                    onClick={() => setActiveTab('places')}
                    className={`pb-3 px-1 flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'places' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                    <MapPin size={18} />
                    <span>Yer Adı Geçmişi</span>
                </button>
            </div>

            {/* Form Area (Conditional) */}
            {isEditing && (
                <div className="mb-8">
                    {activeTab === 'events' ? (
                        <EventForm
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsEditing(false)}
                            initialData={editItem}
                        />
                    ) : (
                        <PlaceForm
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsEditing(false)}
                            initialData={editItem}
                        />
                    )}
                </div>
            )}

            {/* Data Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
                </div>
            ) : (
                <div className="bg-[var(--surface-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--panel-bg)] text-[var(--text-secondary)] font-medium">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">İsim / Başlık</th>
                                <th className="p-4">{activeTab === 'events' ? 'Yıl' : 'Dönem'}</th>
                                <th className="p-4">{activeTab === 'events' ? 'Tür' : 'Modern İsim'}</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-[var(--background)] transition-colors">
                                    <td className="p-4 text-[var(--text-muted)] font-mono">#{item.id}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">
                                        {activeTab === 'events' ? item.name : item.historical_name}
                                    </td>
                                    <td className="p-4 text-[var(--text-secondary)]">
                                        {activeTab === 'events' ? item.year : `${item.start_year} - ${item.end_year}`}
                                    </td>
                                    <td className="p-4 text-[var(--text-secondary)]">
                                        {activeTab === 'events' ? (
                                            <span className={`px-2 py-1 rounded text-xs border ${item.type === 'battle' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500'}`}>
                                                {item.type === 'battle' ? 'Savaş' : 'Antlaşma'}
                                            </span>
                                        ) : (
                                            item.modern_name
                                        )}
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="p-1.5 rounded hover:bg-blue-500/10 text-blue-500 transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
