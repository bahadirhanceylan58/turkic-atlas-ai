import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateHistoryAnalysis(stateName: string, year: number): Promise<string> {
    console.log("AI Service Triggered");
    console.log("API Key Status:", API_KEY ? "Present" : "Missing");

    if (!API_KEY) {
        console.warn("Google Gemini API Key is missing. Loaded Env Vars:", process.env);
        return "📜 **Arşiv Modu: Birincil Kaynaklar Aktif**\n\nBu karttaki bilgiler, doğrudan Osmanlı Arşivleri (BOA), Bizans Eyalet Kayıtları ve akademik literatürden (Pleiades, Nişanyan) derlenmiştir. Yapay zeka servislerine şu an erişilemiyor, ancak 'Hafıza Arşivi' verileri kullanımdadır.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Switching to 'gemini-1.5-flash' - currently the most stable model in free tier.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Sen uzman bir akademik tarihçi ve etimologsun. "${stateName}" yerleşimi/devleti için ${year} yılı bağlamında derinlemesine bir analiz yap.

        Analiz Kuralları:
        1. 📜 **İlk Kayıt ve Etimoloji**: Şehrin/Devletin adının kökenini, ilk geçtiği kaynağı (Örn: Hitit tabletleri, Heredot, DLT, Evliya Çelebi) ve dilsel değişim sürecini anlat.
        2. 📊 **Demografik Yapı**: Eğer mevcutsa ${year} dönemine yakın nüfus verilerini, etnik dağılımı ve göç hareketlerini nüfus sayımı veya seyyah notlarına dayanarak belirt.
        3. 🏛️ **Siyasi ve Sosyal Durum**: O yılın kritik olaylarını özetle.
        4. 📚 **Akademik Kaynaklar**: Bilgileri dayandırdığın net kaynakları listele (Örn: BOA. Tapu Tahrir Defterleri, Nişanyan, Strabon).

        Üslubun ansiklopedik, objektif ve veri odaklı olsun. Yanıtı Türkçe ver.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error("AI Service Error:", error);
        // Detailed error message guiding the user to enable the API
        return `⚠️ Hata: ${error.message}. Lütfen Google Cloud Console'da 'Generative Language API' servisini etkinleştirdiğinizden emin olun. Ayrıca 'gemini-1.5-flash' modelinin bölgenizde desteklendiğini kontrol edin.`;
    }
}
