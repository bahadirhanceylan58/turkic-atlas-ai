import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && (error.message.includes("429") || error.message.includes("Resource exhausted"))) {
            console.warn(`Rate limit hit. Retrying in ${initialDelay}ms... (${retries} attempts left)`);
            await delay(initialDelay);
            return retryWithBackoff(fn, retries - 1, initialDelay * 2);
        }
        throw error;
    }
}

export async function generateHistoryAnalysis(stateName: string, year: number, location?: { lat: number, lng: number }, district?: string): Promise<string> {
    console.log("AI Service Triggered");
    console.log("API Key Status:", API_KEY ? "Present" : "Missing");

    if (!API_KEY) {
        console.warn("Google Gemini API Key is missing. Loaded Env Vars:", process.env);
        return "📜 **Arşiv Modu: Birincil Kaynaklar Aktif**\n\nBu karttaki bilgiler, doğrudan Osmanlı Arşivleri (BOA), Bizans Eyalet Kayıtları ve akademik literatürden (Pleiades, Nişanyan) derlenmiştir. Yapay zeka servislerine şu an erişilemiyor, ancak 'Hafıza Arşivi' verileri kullanımdadır.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Switching to 'gemini-2.0-flash' - confirmed available for this key.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 2048, // Ensure response isn't cut off
                temperature: 0.5 // Lower temperature for more factual responses
            }
        });

        const locationContext = location ? `Koordinatlar: (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : "";
        const districtContext = district ? `İlçe (Kesin Bilgi): ${district}` : "";

        const currentYear = new Date().getFullYear();

        const prompt = `
        Sen Kıdemli bir Tarihçi ve Coğrafyacısın.
        
        **Görev:** Aşağıdaki konum veya bölge için "${year}" yılına odaklanarak kapsamlı bir analiz yap.
        
        **Konum:** ${stateName}
        ${locationContext}
        ${districtContext}

        **ÖNEMLİ KURALLAR:**
        1. Sadece "${year}" yılı ve öncesi hakkında bilgi ver. ASLA gelecekten bahsetme.
        2. Eğer "${year}" yılı günümüzden sonraysa, günümüzdeki durumu anlat.
        3. Yanıtı AYRIŞTIRILABİLİR XML formatında ver.
        
        **YANIT FORMATI (KESİN UYULACAK):**

        <ANALIZ>
        Buraya tarihçe, etimoloji ve önem hakkında detaylı ansiklopedik metin gelecek.
        Markdown formatını kullanabilirsin (başlıklar, kalın yazı).
        Yer adının kökeni ve anlamı hakkında bilgi ver.
        </ANALIZ>

        <DEMOGRAFI>
        {
          "${year}": "~Tahmini Nüfus",
          "1927": "Varsa Veri",
          "2023": "Varsa Veri"
        }
        (Sadece geçerli bir JSON objesi ver. Yorum yapma.)
        </DEMOGRAFI>

        <KAYNAKLAR>
        - Kaynak 1 (Örn: BOA, Tapu Tahrir Defterleri)
        - Kaynak 2 (Örn: Kamus-ı Türki)
        </KAYNAKLAR>
        `;

        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });

    } catch (error: any) {
        if (error.message.includes("429")) {
            return "⚠️ Sistem şu an çok yoğun. Lütfen 10-15 saniye bekleyip tekrar deneyin. (Google API Kotası)";
        }
        console.error("AI Service Error:", error);
        // Detailed error message guiding the user to enable the API
        return `⚠️ Hata: ${error.message}. Lütfen Google Cloud Console'da 'Generative Language API' servisini etkinleştirdiğinizden emin olun. Ayrıca 'gemini-1.5-flash' modelinin bölgenizde desteklendiğini kontrol edin.`;
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
    console.log(`Fetching history for: ${placeName}`);

    if (!API_KEY) {
        console.warn("API Key missing for place name history");
        return [];
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Sen uzman bir etimolog ve tarihçisin. "${placeName}" (Türkiye/Anadolu) şehri veya bölgesi için tarihsel isim değişimlerini JSON formatında listele.

        Kurallar:
        1. Sadece Anadolu/Türkiye bağlamındaki yerleri dikkate al.
        2. Bilinen en eski tarihten (M.Ö.) günümüze kadar kronolojik sırala.
        3. Her dönem için o dönemki ismini, başlangıç-bitiş yılını ve kökenini yaz.
        4. "notes" kısmında ismin anlamını yaz.
        5. "source" kısmında bu ismin geçtiği ana kaynağı belirt (Örn: "Strabon, Geographika", "Evliya Çelebi", "Hittite Tablets").

        JSON Formatı (Dizi):
        [
            {
                "name": "Mirones", 
                "startYear": -2000, 
                "endYear": -1200,
                "language": "Hititçe",
                "meaning": "Güzel Su",
                "notes": "Hitit tabletlerinde geçen ilk isim.",
                "source": "Kültepe Tabletleri"
            }
        ]
        
        Sadece SAF JSON döndür. Markdown bloğu kullanma.
        `;

        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            // Clean markdown code blocks if present
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text) as PlaceNameEntry[];
        });

    } catch (error: any) {
        if (error.message && error.message.includes("429")) {
            console.warn("Returning empty history due to Rate Limit");
        }
        console.error("Place Name History Error:", error);
        return [];
    }
}
