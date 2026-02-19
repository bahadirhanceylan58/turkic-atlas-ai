// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchFromApi<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API request failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.result;
}

export async function generateHistoryAnalysis(stateName: string, year: number, location?: { lat: number, lng: number }, district?: string, knownHistoricalName?: string): Promise<string> {
    try {
        return await fetchFromApi<string>('/api/ai/analyze-history', {
            stateName,
            year,
            location,
            district,
            knownHistoricalName
        });
    } catch (error: any) {
        console.error("AI Service Error:", error);
        if (error.message.includes("429")) {
            return "⚠️ Sistem şu an çok yoğun. Lütfen 10-15 saniye bekleyip tekrar deneyin. (Google API Kotası)";
        }
        return `⚠️ Hata: ${error.message}.`;
    }
}

// Interface for structured history response
export interface PlaceNameEntry {
    name: string;
    startYear: number;
    endYear: number;
    language: string;
    meaning: string;
    notes: string;
    source?: string;
    description?: string;
}

export async function getPlaceNameHistory(placeName: string): Promise<PlaceNameEntry[]> {
    try {
        return await fetchFromApi<PlaceNameEntry[]>('/api/ai/place-history', { placeName });
    } catch (error: any) {
        console.error("Place Name History Error:", error);
        return [];
    }
}

// Battle / Treaty Analysis
export async function generateBattleAnalysis(eventName: string, year: number, parties?: string[], result?: string): Promise<string> {
    try {
        return await fetchFromApi<string>('/api/ai/analyze-battle', {
            eventName,
            year,
            parties,
            result
        });
    } catch (error: any) {
        console.error("Battle Analysis Error:", error);
        return `⚠️ Analiz yapılamadı: ${error.message}`;
    }
}

// Dynasty / Ruler Info
export async function generateDynastyInfo(stateName: string, year: number): Promise<string> {
    try {
        return await fetchFromApi<string>('/api/ai/dynasty-info', { stateName, year });
    } catch (error: any) {
        console.error("Dynasty Info Error:", error);
        return "";
    }
}
