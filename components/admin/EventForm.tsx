"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, X, Loader2 } from 'lucide-react';

interface EventFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
}

export default function EventForm({ onSuccess, onCancel, initialData }: EventFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'battle',
        year: initialData?.year || '',
        lat: initialData?.lat || '',
        lng: initialData?.lng || '',
        description: initialData?.description || '',
        parties: initialData?.parties ? initialData.parties.join(', ') : '',
        result: initialData?.result || '',
        importance: initialData?.importance || 'major',
        source: initialData?.source || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        setLoading(true);

        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
                parties: formData.parties.split(',').map((s: string) => s.trim()).filter((s: string) => s)
            };

            let error;
            if (initialData?.id) {
                const { error: err } = await supabase
                    .from('historical_events')
                    .update(payload)
                    .eq('id', initialData.id);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('historical_events')
                    .insert([payload]);
                error = err;
            }

            if (error) throw error;
            onSuccess();
        } catch (err: any) {
            alert('Hata: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--surface-bg)] p-6 rounded-xl border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {initialData ? 'Olay Düzenle' : 'Yeni Olay Ekle'}
                </h3>
                <button type="button" onClick={onCancel} className="text-[var(--text-muted)] hover:text-red-400">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Olay Adı</label>
                    <input
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Yıl</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Tür</label>
                    <select
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="battle">Savaş (Battle)</option>
                        <option value="treaty">Antlaşma (Treaty)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Önem Derecesi</label>
                    <select
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.importance}
                        onChange={e => setFormData({ ...formData, importance: e.target.value })}
                    >
                        <option value="minor">Düşük (Minor)</option>
                        <option value="major">Orta (Major)</option>
                        <option value="critical">Yüksek (Critical)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Enlem (Lat)</label>
                    <input
                        type="number"
                        step="any"
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.lat}
                        onChange={e => setFormData({ ...formData, lat: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Boylam (Lng)</label>
                    <input
                        type="number"
                        step="any"
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.lng}
                        onChange={e => setFormData({ ...formData, lng: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Taraflar (Virgülle ayırın)</label>
                <input
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                    value={formData.parties}
                    onChange={e => setFormData({ ...formData, parties: e.target.value })}
                    placeholder="Örn: Osmanlı, Bizans"
                />
            </div>

            <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Sonuç</label>
                <input
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                    value={formData.result}
                    onChange={e => setFormData({ ...formData, result: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Açıklama</label>
                <textarea
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)] min-h-[80px]"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Kaynak</label>
                <input
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-sm border border-[var(--border-color)] hover:bg-[var(--surface-bg)] transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm bg-[var(--accent-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Kaydet
                </button>
            </div>
        </form>
    );
}
