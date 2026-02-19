import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    try {
        const { placeName } = await req.json();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Sen akademik düzeyde çalışan bir etimologsun. "${placeName}" yerleşimi için detaylı bir etimolojik döküm hazırla. Bu yer dünyanın herhangi bir yerinde olabilir.

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
