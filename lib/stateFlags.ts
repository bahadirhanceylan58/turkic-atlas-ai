// lib/stateFlags.ts

// Maps the exact uppercase English name (from stateTranslations.ts) to the corresponding flag filename.
export const STATE_FLAGS: Record<string, string> = {
    "OTTOMAN EMPIRE": "ottoman",
    "BYZANTINE EMPIRE": "byzantine",
    "RUM SELJUK SULTANATE": "seljuk",
    "GREAT SELJUK": "seljuk", // From partial matching
    "SELJUK": "seljuk",
    "ROMAN EMPIRE": "roman",
    "SAFAVID EMPIRE": "safavid",
    "SAFAVID": "safavid",
    "TIMURID EMPIRE": "timurid",
    "TIMURID": "timurid",
    "GOLDEN HORDE": "golden_horde",
    "MAMLUK SULTANATE": "mamluk",
    "MAMLUK": "mamluk",
    "GOKTURK KHAGANATE": "gokturk",
    "GOKTURK": "gokturk",
    "UYGHUR KHAGANATE": "uyghur",
    "UYGHUR": "uyghur",
    "MUGHAL EMPIRE": "mughal",
    "MUGHAL": "mughal",
    "ILKHANATE": "ilkhanate",
    "ILKHANLI": "ilkhanate",
    "QARAKHANID KHANATE": "karakhanid",
    "KARAKHANID": "karakhanid",
    "KARA KOYUNLU": "qarakoyunlu",
    "AK KOYUNLU": "akkoyunlu",
    "KHARAZMIAN EMPIRE": "khwarazmian",
    "GHAZNAVID EMPIRE": "ghaznavid",
    "ABBASID CALIPHATE": "abbasid",
    "UMAYYAD CALIPHATE": "umayyad",
    "RUSSIAN EMPIRE": "russian_empire",
    "BRITISH EMPIRE": "british_empire",
    "FRENCH EMPIRE": "french_empire"
};

/**
 * Gets the base ID/name of the flag for a given state name.
 * It checks against both the exact English name and partial matches.
 */
export function getFlagIdForState(englishName: string): string | null {
    if (!englishName) return null;
    const upperName = englishName.toUpperCase();

    // 1. Direct match
    if (STATE_FLAGS[upperName]) return STATE_FLAGS[upperName];

    // 2. Partial match check (e.g., if the raw JSON says "Ottoman Caliphate" or "Seljuk Empire")
    for (const [key, flagId] of Object.entries(STATE_FLAGS)) {
        if (upperName.includes(key)) {
            return flagId;
        }
    }

    return null;
}
