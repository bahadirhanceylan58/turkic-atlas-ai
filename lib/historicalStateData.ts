// Historical State Data
// Includes flags, descriptions, and metadata for major civilizations

export interface HistoricalState {
    id: string;
    name: string;
    flagUrl: string;
    description: string;
    leaders?: string[];
    capital?: string;
}

export const HISTORICAL_STATES: Record<string, HistoricalState> = {
    // TURKIC STATES
    'Göktürk Kağanlığı': {
        id: 'gokturk',
        name: 'Göktürk Kağanlığı',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Flag_of_the_Turkic_Khaganate.svg/1920px-Flag_of_the_Turkic_Khaganate.svg.png',
        description: 'Tarihte "Türk" adını taşıyan ilk devlet. Orta Asya\'da geniş bir coğrafyaya hükmetmişlerdir.',
        leaders: ['Bumin Kağan', 'İstemi Yabgu', 'Bilge Kağan'],
        capital: 'Ötüken'
    },
    'Uygur Kağanlığı': {
        id: 'uyghur',
        name: 'Uygur Kağanlığı',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Flag_of_the_Uyghur_Khaganate.svg/800px-Flag_of_the_Uyghur_Khaganate.svg.png',
        description: 'Yerleşik hayata geçen ilk Türk devletlerinden. Maniheizm dinini benimsemiş, sanat ve ticarette ilerlemişlerdir.',
        leaders: ['Kutluk Bilge Kül Kağan', 'Bögü Kağan'],
        capital: 'Ordu-Balık'
    },
    'Büyük Selçuklu Devleti': {
        id: 'seljuk',
        name: 'Büyük Selçuklu Devleti',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_the_Great_Seljuk_Empire.svg/1920px-Flag_of_the_Great_Seljuk_Empire.svg.png',
        description: 'Orta Doğu ve Anadolu\'da hüküm süren, Türk-İslam medeniyetinin mimarı büyük imparatorluk.',
        leaders: ['Tuğrul Bey', 'Alp Arslan', 'Melikşah'],
        capital: 'Merv / İsfahan'
    },
    'Anadolu Selçuklu Devleti': {
        id: 'rum_seljuk',
        name: 'Anadolu Selçuklu Devleti',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_the_Great_Seljuk_Empire.svg/1920px-Flag_of_the_Great_Seljuk_Empire.svg.png',
        description: 'Anadolu\'yu Türkleştiren ve İslamlaştıran devlet. Mimari ve sanatta altın çağını yaşatmıştır.',
        leaders: ['Süleyman Şah', 'I. Kılıç Arslan', 'Alaaddin Keykubad'],
        capital: 'Konya'
    },
    'Osmanlı İmparatorluğu': {
        id: 'ottoman',
        name: 'Osmanlı İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_the_Ottoman_Empire.svg/1920px-Flag_of_the_Ottoman_Empire.svg.png',
        description: 'Üç kıtada 600 yıl hüküm süren, tarihin en güçlü imparatorluklarından biri.',
        leaders: ['Osman Gazi', 'Fatih Sultan Mehmed', 'Kanuni Sultan Süleyman'],
        capital: 'İstanbul (1453-1922)'
    },
    'Timur İmparatorluğu': {
        id: 'timurid',
        name: 'Timur İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_the_Timurid_Empire.svg/800px-Flag_of_the_Timurid_Empire.svg.png',
        description: 'Timur tarafından kurulan, Orta Asya ve İran\'da hüküm süren Türk-Moğol devleti.',
        leaders: ['Timur', 'Şahruh', 'Uluğ Bey'],
        capital: 'Semerkand'
    },
    'Avrupa Hun İmparatorluğu': {
        id: 'hunnic',
        name: 'Avrupa Hun İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_the_Hunnic_Empire.svg/800px-Flag_of_the_Hunnic_Empire.svg.png',
        description: 'Kavimler Göçü\'nü başlatan ve Roma İmparatorluğu\'nu sarsan büyük güç.',
        leaders: ['Attila', 'Balamir'],
        capital: 'Macaristan Ovaları'
    },

    // OTHER MAJOR POWERS
    'Bizans İmparatorluğu': {
        id: 'byzantine',
        name: 'Bizans İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_the_Byzantine_Empire.svg/1920px-Flag_of_the_Byzantine_Empire.svg.png',
        description: 'Roma İmparatorluğu\'nun doğu devamı. Orta Çağ boyunca Anadolu ve Balkanlar\'da hüküm sürmüştür.',
        leaders: ['Justinianus', 'Herakleios', 'XI. Konstantinos'],
        capital: 'Konstantinopolis'
    },
    'Roma İmparatorluğu': {
        id: 'roman',
        name: 'Roma İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Vexilloid_of_the_Roman_Empire.svg/800px-Vexilloid_of_the_Roman_Empire.svg.png',
        description: 'Antik Çağ\'ın en büyük imparatorluğu. Hukuk, mühendislik ve yönetim alanında modern dünyayı şekillendirmiştir.',
        leaders: ['Augustus', 'Trajan', 'Hadrianus'],
        capital: 'Roma'
    },
    'Moğol İmparatorluğu': {
        id: 'mongol',
        name: 'Moğol İmparatorluğu',
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Flag_of_the_Mongol_Empire.svg/800px-Flag_of_the_Mongol_Empire.svg.png',
        description: 'Tarihin bitişik sınırlara sahip en büyük imparatorluğu.',
        leaders: ['Cengiz Han', 'Kubilay Han'],
        capital: 'Karakurum'
    }
};

export function getStateData(stateName: string): HistoricalState | null {
    if (!stateName) return null;

    // Normalize string for better matching
    const normalizedName = stateName.trim();

    // Direct match
    if (HISTORICAL_STATES[normalizedName]) {
        return HISTORICAL_STATES[normalizedName];
    }

    // Fuzzy Search / Partial Match
    const key = Object.keys(HISTORICAL_STATES).find(k =>
        k.toLowerCase().includes(normalizedName.toLowerCase()) ||
        normalizedName.toLowerCase().includes(k.toLowerCase())
    );

    return key ? HISTORICAL_STATES[key] : null;
}
