// lib/turkicStates.ts

const TURKIC_KEYWORDS = [
    // English / General variants
    "turk", "gokturk", "seljuk", "ottoman", "uyghur", "khazar", "khwarazm", "khwarezm",
    "timurid", "mughal", "golden horde", "safavid", "mamluk", "oghuz", "karluk",
    "kipchak", "cuman", "pecheneg", "bulgar", "kimek", "turgesh", "hephthalite",
    "kushan", "chagatai", "ilkhanate", "kara koyunlu", "ak koyunlu", "hun", "avar",
    "xiongnu", "mongol", "yuan", "ghaznavid", "qarakhanid", "karakhanid",
    "delhi sultanate", "qajar", "afsharid", "sibir", "nogai", "kazakh", "uzbek",
    "kyrgyz", "turkmen", "tatar", "volga", "azerbaijan", "shirvan",

    // Modern States
    "turkey", "republic of turkey", "kazakhstan", "uzbekistan", "turkmenistan",
    "kyrgyzstan", "azerbaijan", "northern cyprus",

    // Turkish variants
    "göktürk", "selçuklu", "osmanlı", "uygur", "hazar", "harzemşah", "timur", "babür",
    "altın orda", "safevi", "memlük", "oğuz", "kıpçak", "kuman", "peçenek", "bulgar",
    "kimek", "türgiş", "akhun", "kuşan", "çağatay", "ilhanlı", "karakoyunlu", "akkoyunlu",
    "hun", "avar", "moğol", "gazneli", "karahanlı", "kaçar", "afşar", "sibir", "nogay",
    "kazak", "özbek", "kırgız", "türkmen", "tatar", "hsiung-nu", "türkiye", "kktc", "azerbaycan"
];

const EXACT_MATCHES = [
    "TURKEY", "KAZAKHSTAN", "UZBEKISTAN", "TURKMENISTAN", "KYRGYZSTAN", "AZERBAIJAN"
];

/**
 * Determines if a historical state name belongs to the Turkic / Mongol world
 * based on keyword matching.
 */
export function isTurkicState(name: string): boolean {
    if (!name || name.toUpperCase() === "UNKNOWN") return false;

    const lowerName = name.toLowerCase();
    const upperName = name.toUpperCase();

    if (EXACT_MATCHES.includes(upperName)) return true;

    return TURKIC_KEYWORDS.some(keyword => lowerName.includes(keyword));
}
