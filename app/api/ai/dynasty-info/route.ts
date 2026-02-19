import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing server" }, { status: 500 });
    }

    try {
        const { stateName, year } = await req.json();

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error("Dynasty Info Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
