"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, X, Loader2 } from 'lucide-react';

interface PlaceFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
}

export default function PlaceForm({ onSuccess, onCancel, initialData }: PlaceFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        modern_name: initialData?.modern_name || '',
        historical_name: initialData?.historical_name || '',
        start_year: initialData?.start_year || '',
        end_year: initialData?.end_year || '',
        language: initialData?.language || '',
        meaning: initialData?.meaning || '',
        lat: initialData?.lat || '',
        lng: initialData?.lng || '',
        source: initialData?.source || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        setLoading(true);

        try {
            const payload = {
                ...formData,
                start_year: parseInt(formData.start_year),
                end_year: parseInt(formData.end_year),
                lat: formData.lat ? parseFloat(formData.lat) : null,
                lng: formData.lng ? parseFloat(formData.lng) : null,
            };

            let error;
            if (initialData?.id) {
                const { error: err } = await supabase
                    .from('place_name_history')
                    .update(payload)
                    .eq('id', initialData.id);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('place_name_history')
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
                    {initialData ? 'Yer Adı Düzenle' : 'Yeni Yer Adı Ekle'}
                </h3>
                <button type="button" onClick={onCancel} className="text-[var(--text-muted)] hover:text-red-400">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Modern İsim</label>
                    <input
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.modern_name}
                        onChange={e => setFormData({ ...formData, modern_name: e.target.value })}
                        placeholder="Örn: İstanbul"
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Tarihi İsim</label>
                    <input
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.historical_name}
                        onChange={e => setFormData({ ...formData, historical_name: e.target.value })}
                        placeholder="Örn: Constantinople"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Başlangıç Yılı</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.start_year}
                        onChange={e => setFormData({ ...formData, start_year: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Bitiş Yılı</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.end_year}
                        onChange={e => setFormData({ ...formData, end_year: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Dil / Köken</label>
                    <input
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.language}
                        onChange={e => setFormData({ ...formData, language: e.target.value })}
                        placeholder="Örn: Yunanca"
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Anlamı</label>
                    <input
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.meaning}
                        onChange={e => setFormData({ ...formData, meaning: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Enlem (Opsiyonel)</label>
                    <input
                        type="number"
                        step="any"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.lat}
                        onChange={e => setFormData({ ...formData, lat: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">Boylam (Opsiyonel)</label>
                    <input
                        type="number"
                        step="any"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2 text-sm text-[var(--text-primary)]"
                        value={formData.lng}
                        onChange={e => setFormData({ ...formData, lng: e.target.value })}
                    />
                </div>
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
