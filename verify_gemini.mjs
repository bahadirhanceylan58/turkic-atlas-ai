
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("API Key not found in environment");
    process.exit(1);
}

console.log("Testing API Key:", API_KEY.substring(0, 10) + "...");

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = "Explain the history of the name 'Adana' briefly in JSON format.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (error) {
        console.error("API Error:", error);
    }
}

test();
