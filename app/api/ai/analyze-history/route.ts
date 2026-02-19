import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    try {
        const { stateName, year, location, district, knownHistoricalName } = await req.json();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.5
            }
        });

        const locationContext = location ? `Koordinatlar: (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : "";
        const districtContext = district ? `İlçe (Kesin Bilgi): ${district}` : "";

        const isModernEra = year >= 1923;
        const eraContext = isModernEra
            ? "Mevcut Türkiye Cumhuriyeti dönemi ve yakın tarih."
            : "Tarihsel dönem (Modern Türkiye öncesi).";

        // Global/Regional Handling
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
           - Eğer yıl 1923 ve sonrası ise: Modern dönem, güncel siyasi/stratejik durum.
           - Eğer yıl 1923 öncesi ise: O dönemin hakim medeniyeti bağlamında kal.
           - **KÜRESEL BAKIŞ:** Analiz edilen yer Türkiye dışında ise, o bölgenin kendi tarihini anlat. Ancak Türk tarihiyle (Hunlar, Göktürkler, Selçuklu, Osmanlı, vb.) bir teması varsa MUTLAKA belirt.
        3. **GERÇEKÇİLİK:** O dönemde yerleşim yoksa veya çok küçükse bunu dürüstçe belirt. Nüfus verilerini uydurma.

        **YANIT FORMATI (KESİN UYULACAK):**

        <ANALIZ>
        **Tarihsel İsim:** ${knownHistoricalName || "[Bulunan İsim]"} (Modern: ${stateName})
        
        Buraya ${year} yılı bağlamında tarihçe, demografik yapı ve önem hakkında ansiklopedik metin gelecek.
        Dönemin hakimi olan devlet/medeniyet bağlamında anlat.
        </ANALIZ>

        <DEMOGRAFI>
        {
          "population": {
             "${year}": 5000,
             "${isModernEra ? '2000' : '1900'}": 10000
          },
          "ethnicity": {
             "Grup A": 60,
             "Grup B": 30,
             "Diğer": 10
          },
          "religion": {
             "Din A": 70,
             "Din B": 30
          }
        }
        (Sadece geçerli bir JSON objesi ver. Sayıları number olarak ver (string değil). Asla sayı uydurma, tahmin ise mantıklı bir tahmin yap ve JSON yapısını bozma.)
        </DEMOGRAFI>

        <KAYNAKLAR>
        - Kaynak 1 (Örn: TÜİK, BOA, Strabon)
        - Kaynak 2 (Varsa)
        </KAYNAKLAR>

        <DEVLET>
        [Devletin Tam Resmi Adı] (Örn: "Büyük Selçuklu Devleti", "Osmanlı İmparatorluğu", "Roma İmparatorluğu", "Türkiye Cumhuriyeti")
        Eğer devlet yoksa veya belirsizse: "Bilinmiyor"
        </DEVLET>
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error("AI Service Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
