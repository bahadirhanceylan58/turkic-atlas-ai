import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AddPlaceModalProps {
    lat: number;
    lng: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPlaceModal({ lat, lng, onClose, onSuccess }: AddPlaceModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('village');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError('Supabase client not initialized');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('places')
                .insert([
                    {
                        name,
                        description,
                        type,
                        lat,
                        lng,
                        source: 'manual', // Mark as manually added
                        historical_data: {} // Empty for now, can be enriched later
                    }
                ]);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error adding place:', err);
            setError(err.message || 'Failed to add place');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold text-slate-100 mb-4">Yeni Yer Ekle</h2>

                <div className="mb-4 text-sm text-slate-400">
                    Konum: <span className="font-mono text-cyan-400">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Yer Adı</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: Eski Köy"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tip</label>
                        <select
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="village">Köy</option>
                            <option value="ruin">Harabe / Ören Yeri</option>
                            <option value="town">Kasaba</option>
                            <option value="city">Şehir</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Açıklama / Notlar</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tarihçesi, eski adları, kaynaklar..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            disabled={loading}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-medium transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
