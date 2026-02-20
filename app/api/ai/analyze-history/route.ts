import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    try {
        const { stateName, year, location, district, knownHistoricalName, extraMetadata } = await req.json();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.5
            }
        });

        const tribeContext = extraMetadata?.type === 'turkic_tribe'
            ? `\n**TURKIC TRIBE CONTEXT:** Bu yerleşim bir **${extraMetadata.tribe}** boyuna (Ait olduğu Kol: ${extraMetadata.branch}) aittir. Analizinde bu bölgenin sıradan tarihinden ZİYADE, doğrudan bu boyun buradaki iskanını, yaşam tarzını, bölgeye bıraktığı kültürel mirası ve tarihi rolünü detaylıca anlat.`
            : extraMetadata?.type === 'historical_figure'
                ? `\n**HISTORICAL FIGURE CONTEXT:** Bu konum, tarihsel şahsiyet **${stateName}** (Unvan: ${extraMetadata?.title || ''}) ile ilişkilidir. Analizinde bu şahsiyetin hayatını, o dönemdeki (${year}) siyasi/kültürel/askeri faaliyetlerini ve bu coğrafyaya olan etkisini detaylandır.`
                : "";

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
        
        **Görev:** Aşağıdaki konum veya bölge için "${year}" yılına (${eraContext}) odaklanarak kapsamlı bir analiz yap.${tribeContext}
        
        **Konum:** ${stateName}
        ${locationContext}
        ${districtContext}

        **ÖNEMLİ KURALLAR:**
        ${nameInstruction}
        2. **ZAMAN BAĞLAMI:** 
           - Eğer yıl 1923 ve sonrası ise: Modern dönem, güncel siyasi/stratejik durum.
           - Eğer yıl 1923 öncesi ise: O dönemin hakim medeniyeti bağlamında kal.
           - **KÜRESEL BAKIŞ:** Analiz edilen yer Türkiye dışında ise, o bölgenin kendi tarihini anlat. Ancak Türk tarihiyle bir teması varsa MUTLAKA belirt.
        3. **KESİN GERÇEKÇİLİK (UYDURMA YASAK):** O dönemde veya bölgede yerleşim yoksa, veya tarihi kaynaklarda adı geçmiyorsa BUNU DÜRÜSTÇE SÖYLE (Örn: "İlgili dönemde burası küçük bir yerleşimdir veya kayıtlarda yer almamaktadır").
        4. **NÜFUS/DEMOGRAFİ UYDURMAK YASAKTIR:** Nüfus verilerini KESİNLİKLE UYDURMA. Eğer spesifik yıla ait bir Osmanlı Tahrir defteri, Roma nüfus sayımı veya kesin bir akademik kayıt veya iyi bir tahmin YOKSA eksik veriyi uydurarak doldurma. Bilinmeyen yılların nüfusunu JSON'a koyma.

        **YANIT FORMATI (KESİN UYULACAK):**

        <ANALIZ>
        **Tarihsel İsim:** ${knownHistoricalName || "[Bulunan İsim]"} (Modern: ${stateName})
        
        Buraya ${year} yılı bağlamında tarihçe, demografik yapı ve önem hakkında ansiklopedik metin gelecek.
        Eğer o yıl için yeterli bilgi/yerleşim yoksa, "Bu dönemde ${stateName} hakkında net bir akademik veri veya büyük bir yerleşim bulunmamaktadır" şeklinde bilgi ver.
        </ANALIZ>

        <DEMOGRAFI>
        {
          "population": {
             "${year}": 5000,
             "${isModernEra ? '2000' : '1900'}": 10000
          },
          "ethnicity": {
             "Grup A": 60,
             "Grup B": 30
          },
          "religion": {
             "Din A": 70,
             "Din B": 30
          }
        }
        (Sadece geçerli bir JSON objesi ver. Sayıları number olarak ver. EĞER TARİHSEL BİR KAYIT YOKSA, SAYI UYDURMA DİYE UYARMIŞTIM. Verisi olmayan dönemleri yazdırma veya JSON haricinde metin ekleme.)
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
