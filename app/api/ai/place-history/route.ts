import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    try {
        const { placeName } = await req.json();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Sen akademik düzeyde çalışan ve YALNIZCA KESİN KAYNAKLARA DAYANAN bir etimologsun. "${placeName}" yerleşimi için detaylı bir etimolojik döküm hazırla.

        **KESİN KURALLAR (İHLAL EDİLEMEZ):**
        1. **ASLA UYDURMA YAPMA:** Eğer bu yer (örneğin ufak bir ilçe, köy veya kasaba) hakkında belirgin ve güvenilir bir antik/tarihi isim kaydı YOKSA, sesteşliğe veya tahmine dayanarak sahte antik isimler (Örn: Kangal için "Kangavar", "Kangana" vb.) ÜRETME.
        2. Sadece bilimsel, yazılı belgelenmiş ve tarihsel veriye dayan. Kaynak yoksa sadece güncel ismi verip bırak, eski dönemleri uydurma.
        3. Halk etimolojisi ve uydurma efsaneler KESİNLİKLE YASAK.
        4. Bilinen en eski GERÇEK isminden günümüze kadar kronolojik sırala.
        5. Her ismin **Kökenini (Dil)**, **Orijinal Yazılışını/Kelime Kökünü** ve **Anlamını** tam biliyorsan belirt.
        6. "source" kısmında bu ismin geçtiği **İlk Kaynağı ve Tarihini** belirt (Örn: "1530, 438 Numaralı Muhasebe-i Vilayet-i Anadolu Defteri", "MÖ 400, Ksenophon"). Kaynağı ampirik olmayan isimleri listeleme.

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
            }
        ]
        
        Sadece SAF JSON döndür. Markdown bloğu kullanma.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean markdown code blocks if present
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json({ result: JSON.parse(text) });

    } catch (error: any) {
        console.error("Place Name History Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
