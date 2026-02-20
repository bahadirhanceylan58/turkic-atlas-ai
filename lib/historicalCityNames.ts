// Historical City Names Database
// Each city has temporal name records with start/end years and the civilization that used that name

export interface HistoricalName {
    name: string;
    startYear: number;
    endYear: number;
    civilization: string;
}

export interface HistoricalCity {
    modernName: string;
    lat: number;
    lng: number;
    names: HistoricalName[];
    type?: 'city' | 'ancient_site'; // New field for categorization
    period?: string; // New field for specific historical period (e.g. Neolithic)
}

/**
 * Given a city and a year, returns the period-appropriate name.
 * Falls back to modern name if no historical record matches.
 */
export function getHistoricalName(city: HistoricalCity, year: number): { name: string; civilization: string } | null {
    const match = city.names.find(n => year >= n.startYear && year <= n.endYear);
    if (match) {
        return { name: match.name, civilization: match.civilization };
    }

    // For ancient sites: if current year is past their last recorded period, show them as ruins
    if (city.type === 'ancient_site') {
        const lastRecord = city.names.reduce((prev, current) => (prev.endYear > current.endYear) ? prev : current);
        if (year > lastRecord.endYear) {
            return { name: lastRecord.name + ' (Ören Yeri)', civilization: 'Harabe / Ören Yeri' };
        }
    }

    return null;
}

/**
 * Returns all cities with their appropriate names for a given year.
 * Only returns cities that existed in that time period.
 */
export function getCitiesForYear(year: number): Array<{
    modernName: string;
    historicalName: string;
    civilization: string;
    lat: number;
    lng: number;
    type: 'city' | 'ancient_site';
    period?: string;
}> {
    return HISTORICAL_CITIES
        .map(city => {
            const match = getHistoricalName(city, year);
            if (match) {
                return {
                    modernName: city.modernName,
                    historicalName: match.name,
                    civilization: match.civilization,
                    lat: city.lat,
                    lng: city.lng,
                    type: city.type || 'city',
                    period: city.period
                };
            }
            return null;
        })
        .filter(Boolean) as any[];
}

// ============================================================
// DATA: Major Historical Cities — ALL COORDINATES VERIFIED
// ============================================================

export const HISTORICAL_CITIES: HistoricalCity[] = [
    // ─── ANTIK ÖREN YERLERİ (ANCIENT SITES) ───
    {
        modernName: 'Göbeklitepe',
        lat: 37.2233,
        lng: 38.9223,
        type: 'ancient_site',
        period: 'Neolitik Çağ (M.Ö. 9500)',
        names: [
            { name: 'Göbeklitepe', startYear: -10000, endYear: -8000, civilization: 'Tarih Öncesi' },
        ],
    },
    {
        modernName: 'Çatalhöyük',
        lat: 37.6675,
        lng: 32.8283,
        type: 'ancient_site',
        period: 'Neolitik Çağ (M.Ö. 7100)',
        names: [
            { name: 'Çatalhöyük', startYear: -7500, endYear: -5700, civilization: 'Neolitik Yerleşim' },
        ],
    },
    {
        modernName: 'Troya',
        lat: 39.9575,
        lng: 26.2389,
        type: 'ancient_site',
        period: 'Tunç Çağı',
        names: [
            { name: 'Wilusa', startYear: -3000, endYear: -1180, civilization: 'Luvi / Hitit' },
            { name: 'Ilion', startYear: -1180, endYear: 400, civilization: 'Yunan / Roma' },
        ],
    },
    {
        modernName: 'Nemrut Dağı',
        lat: 37.9806,
        lng: 38.7408,
        type: 'ancient_site',
        period: 'Helenistik Dönem',
        names: [
            { name: 'Nemrut (Kommagene)', startYear: -163, endYear: 72, civilization: 'Kommagene Krallığı' },
        ],
    },
    {
        modernName: 'Hattuşa',
        lat: 40.0197,
        lng: 34.6153,
        type: 'ancient_site',
        period: 'Tunç Çağı',
        names: [
            { name: 'Hattuşa', startYear: -1650, endYear: -1178, civilization: 'Hitit İmparatorluğu' },
        ],
    },
    {
        modernName: 'Efes',
        lat: 37.9411,
        lng: 27.3419,
        type: 'ancient_site',
        period: 'Antik Çağ',
        names: [
            { name: 'Ephesos', startYear: -1000, endYear: 614, civilization: 'İyonya / Roma' },
        ],
    },
    {
        modernName: 'Aspendos',
        lat: 36.9389,
        lng: 31.1725,
        type: 'ancient_site',
        period: 'Roma Dönemi',
        names: [
            { name: 'Aspendos', startYear: -500, endYear: 600, civilization: 'Roma' },
        ],
    },
    {
        modernName: 'Perge',
        lat: 36.9614,
        lng: 30.8533,
        type: 'ancient_site',
        period: 'Helenistik / Roma',
        names: [
            { name: 'Perge', startYear: -1200, endYear: 700, civilization: 'Pamfilya / Roma' },
        ],
    },
    {
        modernName: 'Zeugma',
        lat: 37.0586,
        lng: 37.8652,
        type: 'ancient_site',
        period: 'Roma Dönemi',
        names: [
            { name: 'Seleukeia Euphrates', startYear: -300, endYear: -64, civilization: 'Selevkos' },
            { name: 'Zeugma', startYear: -64, endYear: 256, civilization: 'Roma İmparatorluğu' },
        ],
    },
    {
        modernName: 'Ani Harabeleri',
        lat: 40.5075,
        lng: 43.5728,
        type: 'ancient_site',
        period: 'Orta Çağ',
        names: [
            { name: 'Ani', startYear: 961, endYear: 1319, civilization: 'Bagratuni / Selçuklu' },
        ],
    },
    {
        modernName: 'Gordion',
        lat: 39.6508,
        lng: 31.9844,
        type: 'ancient_site',
        period: 'Demir Çağı',
        names: [
            { name: 'Gordion', startYear: -1200, endYear: -200, civilization: 'Frigya (Başkent)' },
        ],
    },
    {
        modernName: 'Sardes',
        lat: 38.4877,
        lng: 28.0400,
        type: 'ancient_site',
        period: 'Demir Çağı',
        names: [
            { name: 'Sardes', startYear: -1200, endYear: 616, civilization: 'Lidya (Başkent) / Roma' },
        ],
    },
    {
        modernName: 'Milet',
        lat: 37.5308,
        lng: 27.2782,
        type: 'ancient_site',
        period: 'Antik Çağ',
        names: [
            { name: 'Miletos', startYear: -1000, endYear: 500, civilization: 'İyonya / Roma' },
        ],
    },
    {
        modernName: 'Bergama',
        lat: 39.1218,
        lng: 27.1794,
        type: 'ancient_site',
        period: 'Helenistik Dönem',
        names: [
            { name: 'Pergamon', startYear: -300, endYear: 700, civilization: 'Pergamon Krallığı / Roma' },
        ],
    },
    // ─── DÜNYA GENELİ ANTİK ÖREN YERLERİ (GLOBAL ANCIENT SITES) ───
    {
        आधुनिकAdı: 'Roma Forumu / Kolezyum', modernName: 'Roma',
        lat: 41.8902, lng: 12.4922, type: 'ancient_site', period: 'Antik Roma',
        names: [{ name: 'Roma', startYear: -753, endYear: 476, civilization: 'Roma İmparatorluğu' }]
    },
    {
        modernName: 'Pompeii',
        lat: 40.7486, lng: 14.4843, type: 'ancient_site', period: 'Antik Roma',
        names: [{ name: 'Pompeii', startYear: -600, endYear: 79, civilization: 'Roma İmparatorluğu' }]
    },
    {
        modernName: 'Atina Akropolisi',
        lat: 37.9715, lng: 23.7267, type: 'ancient_site', period: 'Antik Yunan',
        names: [{ name: 'Atina', startYear: -1400, endYear: 86, civilization: 'Yunan Şehir Devletleri' }]
    },
    {
        modernName: 'Babil',
        lat: 32.5363, lng: 44.4208, type: 'ancient_site', period: 'Mezopotamya',
        names: [{ name: 'Babil', startYear: -2300, endYear: 141, civilization: 'Babil İmparatorluğu' }]
    },
    {
        modernName: 'Ur',
        lat: 30.9625, lng: 46.1044, type: 'ancient_site', period: 'Sümerler',
        names: [{ name: 'Ur', startYear: -3800, endYear: -500, civilization: 'Sümer / Akad' }]
    },
    {
        modernName: 'Persepolis',
        lat: 29.9344, lng: 52.8913, type: 'ancient_site', period: 'Antik Pers',
        names: [{ name: 'Parsa', startYear: -515, endYear: -330, civilization: 'Ahameniş İmparatorluğu' }]
    },
    {
        modernName: 'Kartaca',
        lat: 36.8529, lng: 10.3233, type: 'ancient_site', period: 'Fenike / Roma',
        names: [
            { name: 'Kartaca', startYear: -814, endYear: -146, civilization: 'Kartaca İmparatorluğu' },
            { name: 'Colonia Julia Carthago', startYear: -44, endYear: 698, civilization: 'Roma / Bizans' }
        ]
    },
    {
        modernName: 'Gize Piramitleri',
        lat: 29.9792, lng: 31.1342, type: 'ancient_site', period: 'Eski Mısır',
        names: [{ name: 'Memfis', startYear: -2580, endYear: -332, civilization: 'Mısır Firavunları' }]
    },
    {
        modernName: 'Luksor (Teb)',
        lat: 25.6989, lng: 32.6395, type: 'ancient_site', period: 'Eski Mısır',
        names: [{ name: 'Waset (Thebes)', startYear: -2000, endYear: 84, civilization: 'Yeni Krallık (Mısır)' }]
    },
    {
        modernName: 'Petra',
        lat: 30.3289, lng: 35.4402, type: 'ancient_site', period: 'Nebatiler',
        names: [{ name: 'Raqmu (Petra)', startYear: -312, endYear: 106, civilization: 'Nebati Krallığı' }]
    },
    {
        modernName: 'Teotihuacan',
        lat: 19.6925, lng: -98.8438, type: 'ancient_site', period: 'Mezoamerika',
        names: [{ name: 'Teotihuacan', startYear: -100, endYear: 550, civilization: 'Teotihuacan İmparatorluğu' }]
    },
    {
        modernName: 'Chichen Itza',
        lat: 20.6842, lng: -88.5677, type: 'ancient_site', period: 'Maya',
        names: [{ name: 'Chichen Itza', startYear: 600, endYear: 1200, civilization: 'Maya Uygarlığı' }]
    },
    {
        modernName: 'Machu Picchu',
        lat: -13.1631, lng: -72.5449, type: 'ancient_site', period: 'İnka',
        names: [{ name: 'Machu Picchu', startYear: 1450, endYear: 1532, civilization: 'İnka İmparatorluğu' }]
    },
    {
        modernName: 'Angkor Wat',
        lat: 13.4124, lng: 103.8669, type: 'ancient_site', period: 'Khmer',
        names: [{ name: 'Angkor / Yaśodharapura', startYear: 802, endYear: 1431, civilization: 'Khmer İmparatorluğu' }]
    },
    {
        modernName: 'Mohenjo-Daro',
        lat: 27.3292, lng: 68.1389, type: 'ancient_site', period: 'İndus Vadisi',
        names: [{ name: 'Mohenjo-Daro', startYear: -2500, endYear: -1900, civilization: 'İndus Vadisi Uygarlığı' }]
    },
    {
        modernName: 'Terracotta Ordusu (Xi\'an)',
        lat: 34.3840, lng: 109.2785, type: 'ancient_site', period: 'Çin İmparatorluğu',
        names: [{ name: 'Chang\'an', startYear: -210, endYear: -206, civilization: 'Qin Hanedanı' }]
    },
    {
        modernName: 'Stonehenge',
        lat: 51.1788, lng: -1.8262, type: 'ancient_site', period: 'Neolitik',
        names: [{ name: 'Stonehenge', startYear: -3000, endYear: -2000, civilization: 'Tarih Öncesi Britanya' }]
    },
    {
        modernName: 'Knossos',
        lat: 35.2978, lng: 25.1632, type: 'ancient_site', period: 'Minos Uygarlığı',
        names: [{ name: 'Knossos', startYear: -2000, endYear: -1375, civilization: 'Minos Krallığı' }]
    },
    {
        modernName: 'Moai Heykelleri (Paskalya Adası)',
        lat: -27.1127, lng: -109.3496, type: 'ancient_site', period: 'Polinezya',
        names: [{ name: 'Rapa Nui', startYear: 1250, endYear: 1500, civilization: 'Rapa Nui Halkı' }]
    },
    // ─── ANADOLU (TÜRKİYE) ───
    {
        modernName: 'İstanbul',
        lat: 41.0082,
        lng: 28.9784,
        names: [
            { name: 'Byzantion', startYear: -667, endYear: 329, civilization: 'Yunan / Roma' },
            { name: 'Konstantinopolis', startYear: 330, endYear: 1453, civilization: 'Roma / Bizans' },
            { name: 'Kostantiniyye', startYear: 1453, endYear: 1923, civilization: 'Osmanlı' },
            { name: 'İstanbul', startYear: 1923, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'İzmir',
        lat: 38.4189,
        lng: 27.1287,
        names: [
            { name: 'Smyrna', startYear: -1000, endYear: 1424, civilization: 'Yunan / Roma / Bizans' },
            { name: 'İzmir', startYear: 1424, endYear: 2100, civilization: 'Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Ankara',
        lat: 39.9334,
        lng: 32.8597,
        names: [
            { name: 'Ancyra', startYear: -300, endYear: 1073, civilization: 'Galatya / Roma / Bizans' },
            { name: 'Engürü', startYear: 1073, endYear: 1923, civilization: 'Selçuklu / Osmanlı' },
            { name: 'Ankara', startYear: 1923, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'Trabzon',
        lat: 41.0027,
        lng: 39.7168,
        names: [
            { name: 'Trapezous', startYear: -756, endYear: 1204, civilization: 'Yunan / Roma / Bizans' },
            { name: 'Trebizond', startYear: 1204, endYear: 1461, civilization: 'Trabzon İmparatorluğu' },
            { name: 'Trabzon', startYear: 1461, endYear: 2100, civilization: 'Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Antakya',
        lat: 36.2025,
        lng: 36.1597,
        names: [
            { name: 'Antiocheia', startYear: -300, endYear: 637, civilization: 'Selevkos / Roma / Bizans' },
            { name: 'Antakya', startYear: 637, endYear: 1098, civilization: 'Emevi / Abbasi' },
            { name: 'Antioch', startYear: 1098, endYear: 1268, civilization: 'Haçlı Prensliği' },
            { name: 'Antakya', startYear: 1268, endYear: 2100, civilization: 'Memlük / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Diyarbakır',
        lat: 37.9100,
        lng: 40.2370,
        names: [
            { name: 'Amida', startYear: -300, endYear: 639, civilization: 'Roma / Bizans' },
            { name: 'Amid', startYear: 639, endYear: 1515, civilization: 'İslam / Artuklu / Akkoyunlu' },
            { name: 'Diyarbekir', startYear: 1515, endYear: 1923, civilization: 'Osmanlı' },
            { name: 'Diyarbakır', startYear: 1923, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'Konya',
        lat: 37.8746,
        lng: 32.4932,
        names: [
            { name: 'Ikonion', startYear: -300, endYear: 1077, civilization: 'Frigya / Roma / Bizans' },
            { name: 'Konya', startYear: 1077, endYear: 1308, civilization: 'Anadolu Selçuklu (Başkent)' },
            { name: 'Konya', startYear: 1308, endYear: 2100, civilization: 'Karamanoğulları / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Sivas',
        lat: 39.7477,
        lng: 37.0179,
        names: [
            { name: 'Sebasteia', startYear: -64, endYear: 1075, civilization: 'Roma / Bizans' },
            { name: 'Sivas', startYear: 1075, endYear: 2100, civilization: 'Danişmend / Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Edirne',
        lat: 41.6772,
        lng: 26.5557,
        names: [
            { name: 'Hadrianopolis', startYear: 125, endYear: 1362, civilization: 'Roma / Bizans' },
            { name: 'Edirne', startYear: 1362, endYear: 1453, civilization: 'Osmanlı (Başkent)' },
            { name: 'Edirne', startYear: 1453, endYear: 2100, civilization: 'Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Bursa',
        lat: 40.1826,
        lng: 29.0665,
        names: [
            { name: 'Prusa', startYear: -200, endYear: 1326, civilization: 'Bitinya / Roma / Bizans' },
            { name: 'Bursa', startYear: 1326, endYear: 1365, civilization: 'Osmanlı (Başkent)' },
            { name: 'Bursa', startYear: 1365, endYear: 2100, civilization: 'Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Kayseri',
        lat: 38.7312,
        lng: 35.4787,
        names: [
            { name: 'Mazaka', startYear: -500, endYear: -12, civilization: 'Kapadokya' },
            { name: 'Caesarea', startYear: -12, endYear: 1075, civilization: 'Roma / Bizans' },
            { name: 'Kayseri', startYear: 1075, endYear: 2100, civilization: 'Danişmend / Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Antalya',
        lat: 36.8969,
        lng: 30.7133,
        names: [
            { name: 'Attaleia', startYear: -150, endYear: 1207, civilization: 'Pergamon / Roma / Bizans' },
            { name: 'Antalya', startYear: 1207, endYear: 2100, civilization: 'Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Sinop',
        lat: 42.0231,
        lng: 35.1531,
        names: [
            { name: 'Sinope', startYear: -700, endYear: 1214, civilization: 'Yunan / Roma / Bizans' },
            { name: 'Sinop', startYear: 1214, endYear: 2100, civilization: 'Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Erzurum',
        lat: 39.9055,
        lng: 41.2658,
        names: [
            { name: 'Theodosiopolis', startYear: 415, endYear: 1071, civilization: 'Bizans' },
            { name: 'Erzurum', startYear: 1071, endYear: 2100, civilization: 'Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Van',
        lat: 38.5012,
        lng: 43.3730,
        names: [
            { name: 'Tuşpa', startYear: -850, endYear: -585, civilization: 'Urartu (Başkent)' },
            { name: 'Van', startYear: -585, endYear: 2100, civilization: 'Med / Roma / Bizans / İslam / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Mardin',
        lat: 37.3126,
        lng: 40.7350,
        names: [
            { name: 'Marida', startYear: -1000, endYear: 640, civilization: 'Asur / Roma / Bizans' },
            { name: 'Mardin', startYear: 640, endYear: 2100, civilization: 'Artuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Gaziantep',
        lat: 37.0660,
        lng: 37.3781,
        names: [
            { name: 'Antiochia ad Taurum', startYear: -300, endYear: 637, civilization: 'Selevkos / Roma' },
            { name: 'Ayıntab', startYear: 637, endYear: 1921, civilization: 'İslam / Osmanlı' },
            { name: 'Gaziantep', startYear: 1921, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'Şanlıurfa',
        lat: 37.1674,
        lng: 38.7955,
        names: [
            { name: 'Edessa', startYear: -300, endYear: 1144, civilization: 'Selevkos / Roma / Haçlı' },
            { name: 'Ruha', startYear: 1144, endYear: 1923, civilization: 'Zengi / Eyyubi / Osmanlı' },
            { name: 'Şanlıurfa', startYear: 1923, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'Amasya',
        lat: 40.6499,
        lng: 35.8353,
        names: [
            { name: 'Amaseia', startYear: -300, endYear: 1075, civilization: 'Pontus / Roma / Bizans' },
            { name: 'Amasya', startYear: 1075, endYear: 2100, civilization: 'Danişmend / Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Nevşehir',
        lat: 38.6247,
        lng: 34.7117,
        names: [
            { name: 'Nyssa', startYear: -300, endYear: 1071, civilization: 'Kapadokya / Roma / Bizans' },
            { name: 'Muşkara', startYear: 1071, endYear: 1727, civilization: 'Selçuklu / Osmanlı' },
            { name: 'Nevşehir', startYear: 1727, endYear: 2100, civilization: 'Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Malatya',
        lat: 38.3552,
        lng: 38.3095,
        names: [
            { name: 'Melitene', startYear: -1000, endYear: 1101, civilization: 'Hitit / Roma / Bizans' },
            { name: 'Malatya', startYear: 1101, endYear: 2100, civilization: 'Danişmend / Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Adana',
        lat: 37.0017,
        lng: 35.3289,
        names: [
            { name: 'Adana', startYear: -1600, endYear: 2100, civilization: 'Hitit / Roma / Abbasi / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Kastamonu',
        lat: 41.3887,
        lng: 33.7827,
        names: [
            { name: 'Castamon', startYear: -300, endYear: 1213, civilization: 'Roma / Bizans' },
            { name: 'Kastamonu', startYear: 1213, endYear: 2100, civilization: 'Çobanoğulları / Candaroğulları / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Eskişehir',
        lat: 39.7767,
        lng: 30.5206,
        names: [
            { name: 'Dorylaion', startYear: -300, endYear: 1175, civilization: 'Frigya / Roma / Bizans' },
            { name: 'Eskişehir', startYear: 1175, endYear: 2100, civilization: 'Selçuklu / Osmanlı / Türkiye' },
        ],
    },
    {
        modernName: 'Afyonkarahisar',
        lat: 38.7507,
        lng: 30.5567,
        names: [
            { name: 'Akroënos', startYear: -300, endYear: 1071, civilization: 'Frigya / Roma / Bizans' },
            { name: 'Karahisar-ı Sahib', startYear: 1071, endYear: 1923, civilization: 'Selçuklu / Osmanlı' },
            { name: 'Afyonkarahisar', startYear: 1923, endYear: 2100, civilization: 'Türkiye Cumhuriyeti' },
        ],
    },
    {
        modernName: 'Niksar',
        lat: 40.5927,
        lng: 36.9536,
        names: [
            { name: 'Neocaesarea', startYear: -64, endYear: 1071, civilization: 'Roma / Bizans' },
            { name: 'Niksar', startYear: 1071, endYear: 2100, civilization: 'Danişmend (Başkent) / Osmanlı / Türkiye' },
        ],
    },

    // ─── DÜNYA ───
    {
        modernName: 'Roma',
        lat: 41.9028,
        lng: 12.4964,
        names: [
            { name: 'Roma', startYear: -753, endYear: 2100, civilization: 'Roma İmparatorluğu / İtalya' },
        ],
    },
    {
        modernName: 'Atina',
        lat: 37.9838,
        lng: 23.7275,
        names: [
            { name: 'Athenai', startYear: -1000, endYear: -146, civilization: 'Yunan Şehir Devleti' },
            { name: 'Athenae', startYear: -146, endYear: 1453, civilization: 'Roma / Bizans' },
            { name: 'Atina', startYear: 1453, endYear: 2100, civilization: 'Osmanlı / Yunanistan' },
        ],
    },
    {
        modernName: 'Bağdat',
        lat: 33.3152,
        lng: 44.3661,
        names: [
            { name: 'Bağdat', startYear: 762, endYear: 1258, civilization: 'Abbasi Halifeliği (Başkent)' },
            { name: 'Bağdat', startYear: 1258, endYear: 1534, civilization: 'İlhanlı / Celayirli' },
            { name: 'Bağdat', startYear: 1534, endYear: 1917, civilization: 'Osmanlı' },
            { name: 'Bağdat', startYear: 1917, endYear: 2100, civilization: 'Irak' },
        ],
    },
    {
        modernName: 'Kahire',
        lat: 30.0444,
        lng: 31.2357,
        names: [
            { name: 'Memphis', startYear: -3000, endYear: -300, civilization: 'Antik Mısır' },
            { name: 'El-Kahire', startYear: 969, endYear: 2100, civilization: 'Fatımi / Eyyubi / Memlük / Osmanlı / Mısır' },
        ],
    },
    {
        modernName: 'Kudüs',
        lat: 31.7683,
        lng: 35.2137,
        names: [
            { name: 'Yeruşalayim', startYear: -1000, endYear: -586, civilization: 'İsrail Krallığı' },
            { name: 'Aelia Capitolina', startYear: 135, endYear: 637, civilization: 'Roma / Bizans' },
            { name: 'El-Kuds', startYear: 637, endYear: 1099, civilization: 'İslam Halifeliği' },
            { name: 'Jerusalem', startYear: 1099, endYear: 1187, civilization: 'Haçlı Krallığı' },
            { name: 'El-Kuds', startYear: 1187, endYear: 1917, civilization: 'Eyyubi / Memlük / Osmanlı' },
            { name: 'Kudüs', startYear: 1917, endYear: 2100, civilization: 'Modern Dönem' },
        ],
    },
    {
        modernName: 'Semerkand',
        lat: 39.6542,
        lng: 66.9597,
        names: [
            { name: 'Marakanda', startYear: -700, endYear: 700, civilization: 'Sogd / İskender / Kuşan' },
            { name: 'Semerkand', startYear: 700, endYear: 2100, civilization: 'İslam / Timur (Başkent) / Özbekistan' },
        ],
    },
    {
        modernName: 'Isfahan',
        lat: 32.6546,
        lng: 51.6680,
        names: [
            { name: 'Aspadana', startYear: -500, endYear: 640, civilization: 'Pers / Sasani' },
            { name: 'Isfahan', startYear: 640, endYear: 2100, civilization: 'İslam / Selçuklu / Safevi (Başkent) / İran' },
        ],
    },
    {
        modernName: 'Tebriz',
        lat: 38.0800,
        lng: 46.2919,
        names: [
            { name: 'Tauris', startYear: -300, endYear: 642, civilization: 'Part / Sasani' },
            { name: 'Tebriz', startYear: 642, endYear: 1265, civilization: 'İslam / Selçuklu' },
            { name: 'Tebriz', startYear: 1265, endYear: 1501, civilization: 'İlhanlı (Başkent) / Karakoyunlu / Akkoyunlu' },
            { name: 'Tebriz', startYear: 1501, endYear: 2100, civilization: 'Safevi (İlk Başkent) / Kaçar / İran' },
        ],
    },
    {
        modernName: 'Şam',
        lat: 33.5138,
        lng: 36.2765,
        names: [
            { name: 'Damaskos', startYear: -1000, endYear: 634, civilization: 'Arami / Roma / Bizans' },
            { name: 'Dımaşk', startYear: 634, endYear: 750, civilization: 'Emevi Halifeliği (Başkent)' },
            { name: 'Şam', startYear: 750, endYear: 2100, civilization: 'Abbasi / Selçuklu / Osmanlı / Suriye' },
        ],
    },
    {
        modernName: 'Buhara',
        lat: 39.7681,
        lng: 64.4556,
        names: [
            { name: 'Buhara', startYear: -500, endYear: 2100, civilization: 'Sogd / Samani (Başkent) / Timur / Özbekistan' },
        ],
    },
    {
        modernName: 'İskenderiye',
        lat: 31.2001,
        lng: 29.9187,
        names: [
            { name: 'Alexandria', startYear: -331, endYear: 641, civilization: 'Ptolemaios / Roma / Bizans' },
            { name: 'İskenderiye', startYear: 641, endYear: 2100, civilization: 'İslam / Osmanlı / Mısır' },
        ],
    },
    {
        modernName: 'Musul',
        lat: 36.3350,
        lng: 43.1189,
        names: [
            { name: 'Ninova', startYear: -2000, endYear: -612, civilization: 'Asur İmparatorluğu (Başkent)' },
            { name: 'Mosul', startYear: 640, endYear: 2100, civilization: 'İslam / Atabeg / Osmanlı / Irak' },
        ],
    },
    {
        modernName: 'Selanik',
        lat: 40.6401,
        lng: 22.9444,
        names: [
            { name: 'Thessalonike', startYear: -315, endYear: 1430, civilization: 'Makedon / Roma / Bizans' },
            { name: 'Selânik', startYear: 1430, endYear: 1912, civilization: 'Osmanlı' },
            { name: 'Thessaloniki', startYear: 1912, endYear: 2100, civilization: 'Yunanistan' },
        ],
    },
    {
        modernName: 'Sofya',
        lat: 42.6977,
        lng: 23.3219,
        names: [
            { name: 'Serdica', startYear: -300, endYear: 809, civilization: 'Roma / Bizans' },
            { name: 'Sredets', startYear: 809, endYear: 1376, civilization: 'Bulgar' },
            { name: 'Sofya', startYear: 1376, endYear: 1878, civilization: 'Osmanlı' },
            { name: 'Sofia', startYear: 1878, endYear: 2100, civilization: 'Bulgaristan' },
        ],
    },
    {
        modernName: 'Belgrad',
        lat: 44.7866,
        lng: 20.4489,
        names: [
            { name: 'Singidunum', startYear: -300, endYear: 630, civilization: 'Roma / Bizans' },
            { name: 'Belgrat', startYear: 1521, endYear: 1867, civilization: 'Osmanlı' },
            { name: 'Beograd', startYear: 1867, endYear: 2100, civilization: 'Sırbistan' },
        ],
    },
    {
        modernName: 'Kaşgar',
        lat: 39.4704,
        lng: 75.9899,
        names: [
            { name: 'Kaşgar', startYear: -200, endYear: 2100, civilization: 'Uygur / Karahanlı (Başkent) / Moğol / Çin' },
        ],
    },
    {
        modernName: 'Balasagun',
        lat: 42.7400,
        lng: 75.2200,
        names: [
            { name: 'Balasagun', startYear: 850, endYear: 1218, civilization: 'Karahanlı (Başkent) / Karahitay' },
        ],
    },
    {
        modernName: 'Ötüken',
        lat: 47.4500,
        lng: 102.0000,
        names: [
            { name: 'Ötüken', startYear: 552, endYear: 840, civilization: 'Göktürk / Uygur (Kutsal Başkent)' },
        ],
    },
    {
        modernName: 'Karakurum',
        lat: 47.1972,
        lng: 102.7833,
        names: [
            { name: 'Karakorum', startYear: 1220, endYear: 1368, civilization: 'Moğol İmparatorluğu (Başkent)' },
        ],
    },
];
