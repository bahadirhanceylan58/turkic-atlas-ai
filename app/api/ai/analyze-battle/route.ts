import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    try {
        const { eventName, year, parties, result: eventResult } = await req.json();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 2048, temperature: 0.5 }
        });

        const partiesContext = parties ? `Taraflar: ${parties.join(' vs ')}` : '';
        const resultContext = eventResult ? `Sonuç: ${eventResult}` : '';

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
        5. Varsa Türk tarihi açısından değerlendirme (yoksa genel dünya tarihi)

        **FORMAT:** Markdown kullan (başlıklar, kalın yazı). Türkçe yaz. Akademik ama anlaşılır bir dil kullan.
        Maksimum 500 kelime.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error("Battle Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
