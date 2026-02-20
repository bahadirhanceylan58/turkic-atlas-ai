import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = "";

try {
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/(?:NEXT_PUBLIC_)?GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Error reading .env.local:", e);
    process.exit(1);
}

if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Listing models...");
        // Hack to access the model manager directly if possible, or just try a standard request
        // The SDK doesn't expose listModels directly on the main class easily in all versions.
        // Let's try to use the raw API via fetch for listing models to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", data.error);
        } else {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

listModels();
