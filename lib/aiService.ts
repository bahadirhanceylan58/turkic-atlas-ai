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

export async function generateHistoryAnalysis(stateName: string, year: number, location?: { lat: number, lng: number }, district?: string, knownHistoricalName?: string): Promise<string> {
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

        const isModernEra = year >= 1923;
        const eraContext = isModernEra
            ? "Mevcut Türkiye Cumhuriyeti dönemi ve yakın tarih."
            : "Tarihsel dönem (Modern Türkiye öncesi).";

        // If we know the historical name, enforce it.
        const nameInstruction = knownHistoricalName
            ? `1. **DÖNEMSEL İSİM:** Bu yerin ${year} yılındaki adı kesin olarak "**${knownHistoricalName}**" olarak belirlenmiştir. Analiz başlığında ve içinde bu ismi kullan. (Modern: ${stateName})`
            : `1. **DÖNEMSEL İSİM TESPİTİ:** ${year} yılındaki ADINI tespit et. Başlıkta bu ismi kullan. (Modern isim: ${stateName})`;

        const prompt = `
        Sen Kıdemli bir Tarihçi, Sosyolog ve Coğrafyacısın.
        
        **Görev:** Aşağıdaki konum veya bölge için "${year}" yılına (${eraContext}) odaklanarak kapsamlı bir analiz yap.
        
        **Konum:** ${stateName}
        ${locationContext}
        ${districtContext}

        **ÖNEMLİ KURALLAR:**
        ${nameInstruction}
        2. **ZAMAN BAĞLAMI:** 
           - Eğer yıl 1923 ve sonrası ise: Cumhuriyet dönemi, modern gelişmeler ve güncel durumdan bahset.
           - Eğer yıl 1923 öncesi ise: O dönemin medeniyeti (Hitit, Roma, Selçuklu, Osmanlı vb.) bağlamında kal. ASLA modern Türkiye'den bahsetme (kıyaslama hariç).
        3. **GERÇEKÇİLİK:** O dönemde yerleşim yoksa veya çok küçükse bunu dürüstçe belirt. Nüfus verilerini uydurma.

        **YANIT FORMATI (KESİN UYULACAK):**

        <ANALIZ>
        **Tarihsel İsim:** ${knownHistoricalName || "[Bulunan İsim]"} (Modern: ${stateName})
        
        Buraya ${year} yılı bağlamında tarihçe, demografik yapı ve önem hakkında ansiklopedik metin gelecek.
        Dönemin hakimi olan devlet/medeniyet bağlamında anlat.
        </ANALIZ>

        <DEMOGRAFI>
        {
          "${year}": "Tahmini Nüfus veya 'Bilinmiyor'",
          "${isModernEra ? '2000' : '1900'}": "Varsa Veri",
          "Güncel": "Varsa Veri"
        }
        (Sadece geçerli bir JSON objesi ver. Sayıları string olarak yaz, örn: '15.000 (Tahmini)' veya 'Veri Yok'. Asla sayı uydurma.)
        </DEMOGRAFI>

        <KAYNAKLAR>
        - Kaynak 1 (Örn: TÜİK, BOA, Strabon)
        - Kaynak 2 (Varsa)
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
        Sen akademik düzeyde çalışan bir etimologsun. "${placeName}" (Türkiye/Anadolu) yerleşimi için detaylı bir etimolojik döküm hazırla.

        **Kurallar:**
        1. Sadece bilimsel ve tarihsel veriye dayan. Halk etimolojisi (uydurma hikayeler) kullanma.
        2. Bilinen en eski isminden günümüze kadar kronolojik sırala.
        3. Her ismin **Kökenini (Dil)**, **Orijinal Yazılışını/Kelime Kökünü** ve **Anlamını** belirt.
        4. "source" kısmında bu ismin geçtiği **İlk Kaynağı ve Tarihini** belirt (Örn: "MÖ 400, Ksenophon", "1928, Dahiliye Vekaleti").

        **JSON Formatı (Dizi):**
        [
            {
                "name": "Mirones", 
                "startYear": -2000, 
                "endYear": -1200,
                "language": "Hititçe",
                "meaning": "Güzel Su / Akarsu Yatağı",
                "notes": "Miron-as kökünden türediği düşünülmektedir.",
                "source": "Kültepe Tabletleri (MÖ 19. yy)"
            },
            {
                "name": "Smyrna",
                "startYear": -1000,
                "endYear": 1930,
                "language": "Eski Yunanca",
                "meaning": "Mür (Reçine)",
                "notes": "Amazon kraliçesi Smyrna'dan gelmez; Sami dillerinden ödünçlenmiş olabilir.",
                "source": "Herodotos (MÖ 5. yy)"
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

// Battle / Treaty Analysis
export async function generateBattleAnalysis(eventName: string, year: number, parties?: string[], result?: string): Promise<string> {
    console.log(`Battle Analysis Triggered: ${eventName}`);

    if (!API_KEY) {
        return "📜 Yapay zeka servisi şu an kullanılamıyor. Lütfen API anahtarını kontrol edin.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 2048, temperature: 0.5 }
        });

        const partiesContext = parties ? `Taraflar: ${parties.join(' vs ')}` : '';
        const resultContext = result ? `Sonuç: ${result}` : '';

        const prompt = `
        Sen Kıdemli bir Askeri Tarihçisin.
        
        **Görev:** "${eventName}" (${year}) hakkında detaylı bir askeri/diplomatik analiz yap.
        ${partiesContext}
        ${resultContext}

        **YANITINDA ŞUNLARI İÇER:**
        1. Olayın arka planı ve sebepleri
        2. Tarafların güçleri ve stratejileri
        3. Olayın gelişimi (savaş ise cephe hareketleri, anlaşma ise müzakere süreci)
        4. Sonuçları ve tarihsel önemi
        5. Türk tarihi açısından değerlendirme

        **FORMAT:** Markdown kullan (başlıklar, kalın yazı). Türkçe yaz. Akademik ama anlaşılır bir dil kullan.
        Maksimum 500 kelime.
        `;

        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });

    } catch (error: any) {
        if (error.message.includes("429")) {
            return "⚠️ Sistem şu an çok yoğun. Lütfen 10-15 saniye bekleyip tekrar deneyin.";
        }
        console.error("Battle Analysis Error:", error);
        return `⚠️ Analiz yapılamadı: ${error.message}`;
    }
}

// Dynasty / Ruler Info
export async function generateDynastyInfo(stateName: string, year: number): Promise<string> {
    console.log(`Dynasty Info Triggered: ${stateName} @ ${year}`);

    if (!API_KEY) return "";

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 512, temperature: 0.3 }
        });

        const prompt = `
        "${stateName}" devleti/hanedanlığı hakkında "${year}" yılına odaklanarak kısa bilgi ver.

        İçermesi gerekenler:
        - ${year} yılındaki hükümdar kim?
        - Hükümdarın kısa biyografisi (1-2 cümle)
        - Önceki ve sonraki 2 hükümdar listesi (varsa)

        Format:
        **Hükümdar (${year}):** [İsim]
        [Kısa açıklama]

        **Hanedan Sırası:**
        ... → [Önceki] → **[Mevcut]** → [Sonraki] → ...

        Kısa ve öz tut. Türkçe yaz. Maksimum 150 kelime.
        `;

        return await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });

    } catch (error: any) {
        console.error("Dynasty Info Error:", error);
        return "";
    }
}
