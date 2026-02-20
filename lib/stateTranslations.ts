export const EXACT_TRANSLATIONS: Record<string, string> = {
    // Major Empires / States
    "ROMAN EMPIRE": "Roma İmparatorluğu",
    "BYZANTINE EMPIRE": "Bizans İmparatorluğu",
    "OTTOMAN EMPIRE": "Osmanlı İmparatorluğu",
    "RUM SELJUK SULTANATE": "Anadolu Selçuklu Devleti",
    "MONGOL EMPIRE": "Moğol İmparatorluğu",
    "GOLDEN HORDE": "Altın Orda Devleti",
    "TIMURID EMPIRE": "Timur İmparatorluğu",
    "MUGHAL EMPIRE": "Babür İmparatorluğu",
    "SAFAVID EMPIRE": "Safevi Devleti",
    "MAMLUK SULTANATE": "Memlûk Devleti",
    "KHAZAR KHAGANATE": "Hazar Kağanlığı",
    "GOKTURK KHAGANATE": "Göktürk Kağanlığı",
    "UYGHUR KHAGANATE": "Uygur Kağanlığı",
    "KUSHAN EMPIRE": "Kuşan İmparatorluğu",
    "HUNNIC EMPIRE": "Avrupa Hun İmparatorluğu",
    "XIONGNU EMPIRE": "Büyük Hun İmparatorluğu (Hiung-nu)",
    "ACHAEMENID EMPIRE": "Ahameniş İmparatorluğu (Pers)",
    "SASSANID EMPIRE": "Sasani İmparatorluğu",
    "PARTHIAN EMPIRE": "Part İmparatorluğu",
    "MACEDONIAN EMPIRE": "Makedonya İmparatorluğu",
    "ALEXANDER'S EMPIRE": "Büyük İskender İmparatorluğu",
    "SELEUCID EMPIRE": "Selevkos İmparatorluğu",
    "PTOLEMAIC KINGDOM": "Ptolemaios Krallığı",
    "UMAYYAD CALIPHATE": "Emevî Halifeliği",
    "ABBASID CALIPHATE": "Abbasî Halifeliği",
    "FATIMID CALIPHATE": "Fatimî Halifeliği",
    "AYYUBID SULTANATE": "Eyyûbîler Devleti",
    "ILKHANATE": "İlhanlılar",
    "CHAGATAI KHANATE": "Çağatay Hanlığı",
    "KARA KOYUNLU": "Karakoyunlular",
    "AK KOYUNLU": "Akkoyunlular",
    "KHARAZMIAN EMPIRE": "Harzemşahlar Devleti",
    "QARAKHANID KHANATE": "Karahanlılar",
    "GHAZNAVID EMPIRE": "Gazneliler Devleti",
    "DELHI SULTANATE": "Delhi Sultanlığı",
    "QING DYNASTY": "Çing Hanedanı (Çin)",
    "MING DYNASTY": "Ming Hanedanı (Çin)",
    "YUAN DYNASTY": "Yuan Hanedanı (Çin)",
    "SONG DYNASTY": "Song Hanedanı (Çin)",
    "TANG DYNASTY": "Tang Hanedanı (Çin)",
    "HAN DYNASTY": "Han Hanedanı (Çin)",
    "HOLY ROMAN EMPIRE": "Kutsal Roma Cermen İmparatorluğu",
    "FRENCH EMPIRE": "Fransa İmparatorluğu",
    "BRITISH EMPIRE": "Büyük Britanya İmparatorluğu",
    "SPANISH EMPIRE": "İspanyol İmparatorluğu",
    "PORTUGUESE EMPIRE": "Portekiz İmparatorluğu",
    "DUTCH EMPIRE": "Hollanda İmparatorluğu",
    "RUSSIAN EMPIRE": "Rus İmparatorluğu",
    "SOVIET UNION": "Sovyetler Birliği (SSCB)",
    "UNITED STATES": "Amerika Birleşik Devletleri",
    "REPUBLIC OF TURKEY": "Türkiye Cumhuriyeti",

    // Regional / Smaller Entities
    "ANATOLIAN TRIBES": "Anadolu Kavimleri",
    "HITTITES": "Hititler",
    "HURRIAN KINGDOMS": "Hurri Krallıkları",
    "MINOAN": "Minos Uygarlığı",
    "CYCLADIC": "Kiklad Uygarlığı",
    "CITY-STATES": "Şehir Devletleri"
};

// Substring partial matches mapped to correct Turkish Names.
// Checked sequentially, so order matters (longer or more specific first).
export const PARTIAL_TRANSLATIONS: { keyword: string, tr: string }[] = [
    { keyword: "RUM SELJUK", tr: "Anadolu Selçuklu Devleti" },
    { keyword: "ANATOLIAN SELJUK", tr: "Anadolu Selçuklu Devleti" },
    { keyword: "GREAT SELJUK", tr: "Büyük Selçuklu Devleti" },
    { keyword: "SELJUK", tr: "Selçuklu Devleti" }, // Covers "Seljuk Caliphate", "Seljuk Empire", etc.
    { keyword: "MAMLUKE", tr: "Memlûk Sultanlığı" },
    { keyword: "MAMLUK", tr: "Memlûk Sultanlığı" },
    { keyword: "ILKHANLI", tr: "İlhanlılar" },
    { keyword: "ILKHANATE", tr: "İlhanlılar" },
    { keyword: "GOLDEN HORDE", tr: "Altın Orda Devleti" },
    { keyword: "TIMURID", tr: "Timur İmparatorluğu" },
    { keyword: "SAFAVID", tr: "Safevi Devleti" },
    { keyword: "QARA KOYUNLU", tr: "Karakoyunlular" },
    { keyword: "KARA KOYUNLU", tr: "Karakoyunlular" },
    { keyword: "AQ KOYUNLU", tr: "Akkoyunlular" },
    { keyword: "AK KOYUNLU", tr: "Akkoyunlular" },
    { keyword: "KHAZAR", tr: "Hazar Kağanlığı" },
    { keyword: "GOKTURK", tr: "Göktürk Kağanlığı" },
    { keyword: "UYGHUR", tr: "Uygur Kağanlığı" },
    { keyword: "KHARAZM", tr: "Harzemşahlar Devleti" },
    { keyword: "KHWAREZM", tr: "Harzemşahlar Devleti" },
    { keyword: "QARAKHANID", tr: "Karahanlılar" },
    { keyword: "KARAKHANID", tr: "Karahanlılar" },
    { keyword: "GHAZNAVID", tr: "Gazneliler Devleti" },
    { keyword: "MUGHAL", tr: "Babür İmparatorluğu" },
    { keyword: "OTTOMAN", tr: "Osmanlı İmparatorluğu" },
    { keyword: "MONGOL", tr: "Moğol İmparatorluğu" },
    { keyword: "XIONGNU", tr: "Büyük Hun İmparatorluğu (Hiung-nu)" },
    { keyword: "HUNNIC", tr: "Avrupa Hun İmparatorluğu" },
    { keyword: "KUSHAN", tr: "Kuşan İmparatorluğu" },
    { keyword: "DELHI SULTANATE", tr: "Delhi Sultanlığı" },
    { keyword: "UMAYYAD", tr: "Emevî Halifeliği" },
    { keyword: "ABBASID", tr: "Abbasî Halifeliği" },
    { keyword: "FATIMID", tr: "Fatimî Halifeliği" },
    { keyword: "AYYUBID", tr: "Eyyûbîler Devleti" },
    { keyword: "ACHAEMENID", tr: "Ahameniş İmparatorluğu (Pers)" },
    { keyword: "SASSANID", tr: "Sasani İmparatorluğu" },
    { keyword: "PARTHIAN", tr: "Part İmparatorluğu" },
    { keyword: "MACEDONIAN", tr: "Makedonya İmparatorluğu" },
    { keyword: "SELEUCID", tr: "Selevkos İmparatorluğu" },
    { keyword: "PTOLEMAIC", tr: "Ptolemaios Krallığı" },
    { keyword: "FRANKS", tr: "Franklar" },
    { keyword: "GOTHS", tr: "Gotlar" },
    { keyword: "VANDALS", tr: "Vandallar" },
    { keyword: "VISIGOTHS", tr: "Vizigotlar" },
    { keyword: "OSTROGOTHS", tr: "Ostrogotlar" },
    { keyword: "LOMBARDS", tr: "Lombardlar" },
    { keyword: "ANGLO-SAXON", tr: "Anglo-Saksonlar" },
    { keyword: "CELTS", tr: "Keltler" },
    { keyword: "SLAVS", tr: "Slavlar" },
    { keyword: "SCYTHIAN", tr: "İskitler (Sakalar)" },
    { keyword: "SARMATIAN", tr: "Sarmatlar" },
    { keyword: "ALANS", tr: "Alanlar" },
    { keyword: "AVARS", tr: "Avarlar" },
    { keyword: "MAGYARS", tr: "Macarlar" },
    { keyword: "BULGARS", tr: "Bulgarlar" },
    { keyword: "PECHENEG", tr: "Peçenekler" },
    { keyword: "CUMAN", tr: "Kumanlar (Kıpçaklar)" },
    { keyword: "KIPCHAK", tr: "Kıpçaklar" },
    { keyword: "KIMEK", tr: "Kimekler" },
    { keyword: "KARLUK", tr: "Karluklar" },
    { keyword: "OGHUZ", tr: "Oğuz Türkleri" },
    { keyword: "TARTAR", tr: "Tatarlar" },
    { keyword: "UZBEK", tr: "Özbekler" },
    { keyword: "KAZAKH", tr: "Kazaklar" },
    { keyword: "KYRGYZ", tr: "Kırgızlar" },
    { keyword: "TURKMEN", tr: "Türkmenler" },
    { keyword: "AZERBAIJAN", tr: "Azerbaycanlılar" }
];

/**
 * Translates an English historical state name to Turkish with the English name in parentheses.
 * E.g. "Seljuk Caliphate" -> "Selçuklu Devleti (Seljuk Caliphate)"
 */
export function getTranslatedName(englishName: string): string {
    if (!englishName || englishName.toUpperCase() === "UNKNOWN") return englishName;

    const upperName = englishName.toUpperCase();

    // 1. Try exact match first
    let trName = EXACT_TRANSLATIONS[upperName];

    // 2. Try partial match if no exact match found
    if (!trName) {
        const partialMatch = PARTIAL_TRANSLATIONS.find(p => upperName.includes(p.keyword));
        if (partialMatch) {
            trName = partialMatch.tr;
        }
    }

    if (trName) {
        // If we have a translation, format as "Turkish Name (English Name)"
        const formattedEnglish = englishName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return `${trName}\n(${formattedEnglish})`;
    }

    // Fallback: If no translation exists, just return the original string
    return englishName;
}
