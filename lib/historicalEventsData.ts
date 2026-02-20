import { HistoricalEvent } from '@/components/HistoryModePanel';

export const HISTORICAL_EVENTS_DATA: HistoricalEvent[] = [
    // ─── İLK ÇAĞ ───
    {
        id: 1,
        name: 'Kadeş Muharebesi',
        type: 'battle',
        year: -1274,
        lat: 34.5695,
        lng: 36.4675,
        parties: ['Hitit İmparatorluğu', 'Mısır Yeni Krallığı'],
        result: 'Tarihin bilinen en büyük savaş arabası muharebesidir. Sonuçsuz kalmıştır.',
        importance: 'critical',
        source: 'Kadeş Antlaşması (Tarihteki ilk yazılı barış antlaşması)'
    },
    // ─── TÜRK TARİHİ SAVAŞLARI ───
    {
        id: 2,
        name: 'Talas Muharebesi',
        type: 'battle',
        year: 751,
        lat: 42.5200,
        lng: 72.2400,
        parties: ['Abbasiler & Karluklar', 'Çin Tang Hanedanı'],
        result: 'Müslüman Araplar ve Türk müttefikleri savaşı kazandı. Orta Asya\'nın Çinleşmesi durduruldu ve İslamiyet Türkler arasında yayılmaya başladı.',
        importance: 'critical',
        source: 'İslam Tarihi Kaynakları'
    },
    {
        id: 3,
        name: 'Dandanakan Muharebesi',
        type: 'battle',
        year: 1040,
        lat: 37.3800,
        lng: 61.1500,
        parties: ['Büyük Selçuklu İmparatorluğu', 'Gazne Devleti'],
        result: 'Selçuklular kazandı. Gazne Devleti yıkılış sürecine girerken, Büyük Selçuklu Devleti fiilen kuruldu.',
        importance: 'critical',
        source: 'Selçuklu Tarihi'
    },
    {
        id: 4,
        name: 'Malazgirt Meydan Muharebesi',
        type: 'battle',
        year: 1071,
        lat: 39.1458,
        lng: 42.5414,
        parties: ['Büyük Selçuklu İmparatorluğu', 'Bizans İmparatorluğu'],
        result: 'Alparslan komutasındaki Selçuklu ordusu Romen Diyojen\'i esir aldı. Anadolu\'nun kapıları Türklere açıldı.',
        importance: 'critical',
        source: 'İslam ve Bizans Kaynakları'
    },
    {
        id: 5,
        name: 'Miryokefalon Muharebesi',
        type: 'battle',
        year: 1176,
        lat: 38.0000,
        lng: 30.7000,
        parties: ['Anadolu Selçuklu Devleti', 'Bizans İmparatorluğu'],
        result: 'II. Kılıçarslan Bizans ordusunu pusuya düşürdü. Anadolu\'nun kesin olarak Türk yurdu olduğu kanıtlandı.',
        importance: 'major',
        source: 'Selçuklu Kaynakları'
    },
    {
        id: 6,
        name: 'Ankara Muharebesi',
        type: 'battle',
        year: 1402,
        lat: 40.1000,
        lng: 33.0000,
        parties: ['Timur İmparatorluğu', 'Osmanlı Devleti'],
        result: 'Timur savaşı kazandı ve Yıldırım Bayezid esir düştü. Osmanlı Devleti Fetret Devri\'ne girdi.',
        importance: 'critical',
        source: 'Timur ve Osmanlı Kaynakları'
    },
    {
        id: 7,
        name: 'Varna Muharebesi',
        type: 'battle',
        year: 1444,
        lat: 43.2141,
        lng: 27.9147,
        parties: ['Osmanlı Devleti', 'Haçlı İttifakı'],
        result: 'Osmanlı kazandı. Haçlıların Balkanları Türklerden temizleme umutları ağır darbe aldı.',
        importance: 'major',
        source: 'Osmanlı Kronikleri'
    },
    {
        id: 8,
        name: 'İstanbul\'un Fethi',
        type: 'battle',
        year: 1453,
        lat: 41.0082,
        lng: 28.9784,
        parties: ['Osmanlı İmparatorluğu', 'Bizans İmparatorluğu'],
        result: 'Fatih Sultan Mehmed İstanbul\'u fethetti. Bizans yıkıldı, Orta Çağ kapandı.',
        importance: 'critical',
        source: 'Osmanlı Arşivleri, Tursun Bey'
    },
    {
        id: 9,
        name: 'Mohaç Meydan Muharebesi',
        type: 'battle',
        year: 1526,
        lat: 45.9400,
        lng: 18.6800,
        parties: ['Osmanlı İmparatorluğu', 'Macaristan Krallığı'],
        result: 'Kanuni Sultan Süleyman 2 saatte Macar ordusunu yok etti. Macaristan Osmanlı egemenliğine girdi.',
        importance: 'critical',
        source: 'Osmanlı Arşivi'
    },
    {
        id: 10,
        name: 'Karlofça Antlaşması',
        type: 'treaty',
        year: 1699,
        lat: 45.2000,
        lng: 19.9300,
        parties: ['Osmanlı İmparatorluğu', 'Kutsal İttifak'],
        result: 'Osmanlı ilk defa büyük çapta toprak kaybetti ve gerileme dönemine girdi.',
        importance: 'critical',
        source: 'Karlofça Müzakereleri'
    },
    {
        id: 11,
        name: 'Sakarya Meydan Muharebesi',
        type: 'battle',
        year: 1921,
        lat: 39.5800,
        lng: 31.9800,
        parties: ['TBMM (Türk Ordusu)', 'Yunanistan Krallığı'],
        result: 'Mustafa Kemal Paşa komutasındaki Türk ordusu Yunan ilerleyişini durdurdu. 1683\'ten beri süren geri çekilme sona erdi.',
        importance: 'critical',
        source: 'İstiklal Harbi Belgeleri'
    },
    {
        id: 12,
        name: 'Büyük Taarruz / Dumlupınar',
        type: 'battle',
        year: 1922,
        lat: 38.7400,
        lng: 29.9800,
        parties: ['TBMM (Türk Ordusu)', 'Yunanistan Krallığı'],
        result: 'Türk ordusu kesin zafer kazandı. Yunan ordusu Anadolu\'dan atıldı.',
        importance: 'critical',
        source: 'Genelkurmay Askeri Tarih Arşivi'
    },
    {
        id: 13,
        name: 'Lozan Barış Antlaşması',
        type: 'treaty',
        year: 1923,
        lat: 46.5197,
        lng: 6.6323,
        parties: ['TBMM', 'İngiltere, Fransa, İtalya, Japonya, Yunanistan'],
        result: 'Modern Türkiye\'nin sınırları ve bağımsızlığı uluslararası alanda tanındı.',
        importance: 'critical',
        source: 'Lozan Tutanakları'
    }
];
