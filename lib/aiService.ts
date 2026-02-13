import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateHistoryAnalysis(stateName: string, year: number): Promise<string> {
    if (!API_KEY) {
        console.warn("Google Gemini API Key is missing.");
        return "⚠️ API Anahtarı eksik. Lütfen .env.local dosyasını kontrol edin. Demo Modu: Devlet verileri şu an simüle edilmektedir.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Sen kıdemli bir tarihçi ve stratejistsin. "${stateName}" devletinin ${year} yılındaki durumunu analiz et.
        
        Yanıtı aşağıdaki formatta ve Türkçe olarak ver. Her madde kısa ve öz olsun (maksimum 2 cümle).
        
        1. ⚔️ Askeri Durum: (Kısa özet)
        2. 💰 Ekonomi ve Ticaret: (Kısa özet)
        3. 🏛️ Jeopolitik Riskler: (Kısa özet)
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("AI Service Error:", error);
        return "⚠️ Analiz şu an oluşturulamadı. (Yapay zeka servisine ulaşılamıyor veya kota doldu).";
    }
}
