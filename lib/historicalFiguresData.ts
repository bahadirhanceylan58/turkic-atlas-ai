// lib/historicalFiguresData.ts

export interface HistoricalFigure {
    id: string;
    name: string;
    birthYear: number | null; // null if unknown, but generally we need a start
    deathYear: number | null;
    activeStartYear: number;  // The year they started being prominent (rule started, book published, etc.)
    activeEndYear: number;    // The year they stopped being prominent (death, deposed, etc.)
    lat: number;
    lng: number;
    title: string;            // e.g., "Sultan", "Scholar", "Khagan"
    description?: string;
    civilization: string;
}

// Initial dataset of important figures across Turkic and World History
export const HISTORICAL_FIGURES_DATA: HistoricalFigure[] = [
    // Ottoman Empire
    {
        id: "osman_i",
        name: "Osman Gazi",
        birthYear: 1258,
        deathYear: 1326,
        activeStartYear: 1299,
        activeEndYear: 1326,
        lat: 40.1444, // Söğüt / Bursa area
        lng: 30.1833,
        title: "Kurucu Sultan",
        civilization: "Osmanlı",
    },
    {
        id: "mehmed_ii",
        name: "Fatih Sultan Mehmed",
        birthYear: 1432,
        deathYear: 1481,
        activeStartYear: 1444,
        activeEndYear: 1481,
        lat: 41.0082, // Istanbul
        lng: 28.9784,
        title: "Sultan",
        civilization: "Osmanlı",
    },
    {
        id: "suleiman_i",
        name: "Kanuni Sultan Süleyman",
        birthYear: 1494,
        deathYear: 1566,
        activeStartYear: 1520,
        activeEndYear: 1566,
        lat: 41.0115, // Istanbul Topkapi
        lng: 28.9833,
        title: "Sultan",
        civilization: "Osmanlı",
    },
    {
        id: "mimar_sinan",
        name: "Mimar Sinan",
        birthYear: 1490,
        deathYear: 1588,
        activeStartYear: 1538, // Chief architect
        activeEndYear: 1588,
        lat: 41.015, // Istanbul
        lng: 28.96,
        title: "Başmimar",
        civilization: "Osmanlı",
    },
    {
        id: "piri_reis",
        name: "Piri Reis",
        birthYear: 1465,
        deathYear: 1553,
        activeStartYear: 1494,
        activeEndYear: 1553,
        lat: 40.14, // Gelibolu (Birthplace/Naval base)
        lng: 26.4,
        title: "Kaptan-ı Derya, Haritacı",
        civilization: "Osmanlı",
    },
    // Great Seljuks & Rum Seljuks
    {
        id: "tughril_beg",
        name: "Tuğrul Bey",
        birthYear: 990,
        deathYear: 1063,
        activeStartYear: 1037, // Foundation of Seljuk Empire
        activeEndYear: 1063,
        lat: 36.3, // Nishapur (early capital)
        lng: 58.8,
        title: "Sultan",
        civilization: "Büyük Selçuklu",
    },
    {
        id: "alp_arslan",
        name: "Alp Arslan",
        birthYear: 1029,
        deathYear: 1072,
        activeStartYear: 1064,
        activeEndYear: 1072,
        lat: 38.0, // Rey / Isfahan area
        lng: 51.0,
        title: "Sultan",
        civilization: "Büyük Selçuklu",
    },
    {
        id: "malik_shah",
        name: "Melikşah",
        birthYear: 1055,
        deathYear: 1092,
        activeStartYear: 1072,
        activeEndYear: 1092,
        lat: 32.65, // Isfahan
        lng: 51.66,
        title: "Sultan",
        civilization: "Büyük Selçuklu",
    },
    {
        id: "kilij_arslan_i",
        name: "I. Kılıç Arslan",
        birthYear: 1079,
        deathYear: 1107,
        activeStartYear: 1092,
        activeEndYear: 1107,
        lat: 37.8667, // Konya / Iznik area
        lng: 32.4833,
        title: "Anadolu Selçuklu Sultanı",
        civilization: "Anadolu Selçuklu",
    },
    {
        id: "mevlana",
        name: "Mevlânâ Celâleddîn-i Rûmî",
        birthYear: 1207,
        deathYear: 1273,
        activeStartYear: 1228, // Arrival in Konya
        activeEndYear: 1273,
        lat: 37.8715, // Konya
        lng: 32.505,
        title: "Şair, Alim",
        civilization: "Anadolu Selçuklu",
    },
    // Timurid Empire
    {
        id: "timur",
        name: "Timur",
        birthYear: 1336,
        deathYear: 1405,
        activeStartYear: 1370,
        activeEndYear: 1405,
        lat: 39.654, // Samarkand
        lng: 66.959,
        title: "Emir",
        civilization: "Timurlu",
    },
    {
        id: "ulugh_beg",
        name: "Uluğ Bey",
        birthYear: 1394,
        deathYear: 1449,
        activeStartYear: 1411, // Governor of Samarkand
        activeEndYear: 1449,
        lat: 39.67, // Samarkand (Observatory)
        lng: 66.98,
        title: "Sultan, Astronom",
        civilization: "Timurlu",
    },
    {
        id: "ali_qushji",
        name: "Ali Kuşçu",
        birthYear: 1403,
        deathYear: 1474,
        activeStartYear: 1430,
        activeEndYear: 1474,
        lat: 39.66, // Samarkand / later Istanbul
        lng: 66.97,
        title: "Astronom, Matematikçi",
        civilization: "Timurlu/Osmanlı",
    },
    // Babur / Mughal
    {
        id: "babur",
        name: "Babür Şah",
        birthYear: 1483,
        deathYear: 1530,
        activeStartYear: 1494, // Ruler of Fergana
        activeEndYear: 1530,
        lat: 34.528, // Kabul (early) / Agra
        lng: 69.172,
        title: "Kurucu İmparator",
        civilization: "Babürlü",
    },
    {
        id: "akbar",
        name: "Ekber Şah",
        birthYear: 1542,
        deathYear: 1605,
        activeStartYear: 1556,
        activeEndYear: 1605,
        lat: 27.17, // Agra
        lng: 78.0,
        title: "İmparator",
        civilization: "Babürlü",
    },
    // Safavid
    {
        id: "ismail_i",
        name: "Şah İsmail (Hatai)",
        birthYear: 1487,
        deathYear: 1524,
        activeStartYear: 1501,
        activeEndYear: 1524,
        lat: 38.08, // Tabriz
        lng: 46.29,
        title: "Kurucu Şah",
        civilization: "Safevi",
    },
    {
        id: "abbas_i",
        name: "Büyük Şah Abbas",
        birthYear: 1571,
        deathYear: 1629,
        activeStartYear: 1588,
        activeEndYear: 1629,
        lat: 32.65, // Isfahan
        lng: 51.66,
        title: "Şah",
        civilization: "Safevi",
    },
    // Early Turkic Khaganates / Eurasian Steppe
    {
        id: "bilge_khagan",
        name: "Bilge Kağan",
        birthYear: 683,
        deathYear: 734,
        activeStartYear: 716,
        activeEndYear: 734,
        lat: 47.33, // Orkhon Valley approx
        lng: 102.83,
        title: "Kağan",
        civilization: "II. Göktürk",
    },
    {
        id: "tonyukuk",
        name: "Tonyukuk",
        birthYear: 646,
        deathYear: 726,
        activeStartYear: 680,
        activeEndYear: 726,
        lat: 47.6, // Ulan Bator area
        lng: 107.0,
        title: "Vezir, Komutan",
        civilization: "II. Göktürk",
    },
    {
        id: "kultegin",
        name: "Kültigin",
        birthYear: 684,
        deathYear: 731,
        activeStartYear: 716,
        activeEndYear: 731,
        lat: 47.35, // Orkhon Valley
        lng: 102.85,
        title: "Tigin, Komutan",
        civilization: "II. Göktürk",
    },
    {
        id: "modu_chanyu",
        name: "Mete Han (Modu Chanyu)",
        birthYear: -234, // Approximate BCE
        deathYear: -174,
        activeStartYear: -209,
        activeEndYear: -174,
        lat: 47.0, // Mongolia Steppes
        lng: 103.0,
        title: "Şanyu",
        civilization: "Büyük Hun (Hiung-nu)",
    },
    {
        id: "attila",
        name: "Attila",
        birthYear: 406,
        deathYear: 453,
        activeStartYear: 434,
        activeEndYear: 453,
        lat: 47.0, // Pannonia / Hungary
        lng: 19.0,
        title: "Tanrının Kırbacı, Hükümdar",
        civilization: "Avrupa Hun",
    },
    // Scholars & Polymaths
    {
        id: "ibn_sina",
        name: "İbn-i Sina (Avicenna)",
        birthYear: 980,
        deathYear: 1037,
        activeStartYear: 1000,
        activeEndYear: 1037,
        lat: 39.25, // Afshana / Bukhara
        lng: 64.35,
        title: "Filozof, Hekim",
        civilization: "Samanid / Buyid",
    },
    {
        id: "al_farabi",
        name: "Farabi",
        birthYear: 872,
        deathYear: 950,
        activeStartYear: 900,
        activeEndYear: 950,
        lat: 42.6, // Otrar / Farab
        lng: 68.3,
        title: "Filozof (Muallim-i Sani)",
        civilization: "Karahanlı / Abbasi",
    },
    {
        id: "al_khwarizmi",
        name: "Harezmi",
        birthYear: 780,
        deathYear: 850,
        activeStartYear: 810, // House of Wisdom
        activeEndYear: 850,
        lat: 41.38, // Khiva / Baghdad
        lng: 60.36,
        title: "Matematikçi, Astronom",
        civilization: "Abbasi (Harzem)",
    },
    {
        id: "mahmud_kashgari",
        name: "Kaşgarlı Mahmud",
        birthYear: 1005,
        deathYear: 1102,
        activeStartYear: 1072, // Writing DLT
        activeEndYear: 1077,
        lat: 39.46, // Kashgar
        lng: 75.98,
        title: "Dilbilimci",
        civilization: "Karahanlı",
    },
    {
        id: "yusuf_khas_hajib",
        name: "Yusuf Has Hacib",
        birthYear: 1017,
        deathYear: 1077,
        activeStartYear: 1069, // Kutadgu Bilig
        activeEndYear: 1070,
        lat: 42.8, // Balasagun
        lng: 75.3,
        title: "Şair, Yazar",
        civilization: "Karahanlı",
    },
    // Ayyubids, Mamluks, Others
    {
        id: "saladin",
        name: "Selahaddin Eyyubi",
        birthYear: 1137,
        deathYear: 1193,
        activeStartYear: 1174,
        activeEndYear: 1193,
        lat: 33.513, // Damascus / Cairo
        lng: 36.292,
        title: "Sultan",
        civilization: "Eyyübi",
    },
    {
        id: "baibars",
        name: "Sultan Baybars",
        birthYear: 1223,
        deathYear: 1277,
        activeStartYear: 1260,
        activeEndYear: 1277,
        lat: 30.04, // Cairo
        lng: 31.23,
        title: "Sultan",
        civilization: "Memlûk",
    },
    {
        id: "genghis_khan",
        name: "Cengiz Han",
        birthYear: 1162,
        deathYear: 1227,
        activeStartYear: 1206, // Kurultai
        activeEndYear: 1227,
        lat: 48.0, // Karakorum approx
        lng: 102.0,
        title: "Büyük Han",
        civilization: "Moğol",
    },
    {
        id: "batu_khan",
        name: "Batu Han",
        birthYear: 1205,
        deathYear: 1255,
        activeStartYear: 1240, // Founded Golden Horde
        activeEndYear: 1255,
        lat: 47.16, // Sarai Batu
        lng: 47.45,
        title: "Han",
        civilization: "Altın Orda",
    },
    // --- ANCIENT & PRE-ISLAMIC EXPANSION ---
    {
        id: "tomris_khatun",
        name: "Tomris Hatun",
        birthYear: -570, // Approximated
        deathYear: -520,
        activeStartYear: -530,
        activeEndYear: -520,
        lat: 41.5, // Central Asia / Syr Darya region
        lng: 63.5,
        title: "Kraliçe (Hükümdar)",
        civilization: "İskit / Saka",
    },
    {
        id: "teoman",
        name: "Teoman",
        birthYear: -270, // Approx
        deathYear: -209,
        activeStartYear: -220,
        activeEndYear: -209,
        lat: 47.5, // Mongolia
        lng: 104.0,
        title: "Şanyu",
        civilization: "Büyük Hun (Hiung-nu)",
    },
    {
        id: "bumin_khagan",
        name: "Bumin Kağan",
        birthYear: 490, // Approx
        deathYear: 552,
        activeStartYear: 542,
        activeEndYear: 552,
        lat: 47.33, // Orkhon Valley approx
        lng: 102.83,
        title: "Kurucu Kağan",
        civilization: "I. Göktürk",
    },
    {
        id: "istemi_yabgu",
        name: "İstemi Yabgu",
        birthYear: 500, // Approx
        deathYear: 576,
        activeStartYear: 552,
        activeEndYear: 576,
        lat: 42.8, // Talas / Western Steppes
        lng: 71.4,
        title: "Batı Yabgusu",
        civilization: "I. Göktürk (Batı)",
    },
    {
        id: "alp_er_tunga",
        name: "Alp Er Tunga",
        birthYear: -750, // Legendary / Approximated
        deathYear: -650,
        activeStartYear: -700,
        activeEndYear: -650,
        lat: 39.5, // Iran-Turkestan Border
        lng: 62.0,
        title: "Efsanevi Hükümdar",
        civilization: "Saka",
    },
    // --- MEDIEVAL EXPANSION (Seljuks, Beyliks, Mamluks) ---
    {
        id: "nizam_al_mulk",
        name: "Nizâmülmülk",
        birthYear: 1018,
        deathYear: 1092,
        activeStartYear: 1064, // Vizierate
        activeEndYear: 1092,
        lat: 36.3, // Nishapur / Isfahan
        lng: 58.8,
        title: "Büyük Vezir",
        civilization: "Büyük Selçuklu",
    },
    {
        id: "ahi_evran",
        name: "Ahi Evran",
        birthYear: 1171,
        deathYear: 1261,
        activeStartYear: 1205, // Guild formation
        activeEndYear: 1261,
        lat: 39.14, // Kırşehir
        lng: 34.16,
        title: "Ahilik Teşkilatı Kurucusu",
        civilization: "Anadolu Selçuklu",
    },
    {
        id: "yunus_emre",
        name: "Yunus Emre",
        birthYear: 1238, // Approx
        deathYear: 1320,
        activeStartYear: 1270,
        activeEndYear: 1320,
        lat: 39.75, // Eskişehir/Sivrihisar
        lng: 31.0,
        title: "Halk Şairi, Mutasavvıf",
        civilization: "Anadolu Selçuklu / Beylikler",
    },
    {
        id: "haci_bektas_veli",
        name: "Hacı Bektaş-ı Veli",
        birthYear: 1209,
        deathYear: 1271,
        activeStartYear: 1240, // Arrival in Anatolia
        activeEndYear: 1271,
        lat: 38.94, // Hacıbektaş / Nevşehir
        lng: 34.56,
        title: "Mutasavvıf, Düşünür",
        civilization: "Anadolu Selçuklu",
    },
    {
        id: "ertugrul_gazi",
        name: "Ertuğrul Gazi",
        birthYear: 1198,
        deathYear: 1281,
        activeStartYear: 1230, // Settlement in Söğüt
        activeEndYear: 1281,
        lat: 40.1444, // Söğüt
        lng: 30.1833,
        title: "Kayı Boyu Lideri",
        civilization: "Uç Beyliği",
    },
    {
        id: "chaka_bey",
        name: "Çaka Bey",
        birthYear: 1040, // Approx
        deathYear: 1092,
        activeStartYear: 1081, // Emirate in Izmir
        activeEndYear: 1092,
        lat: 38.4237, // Izmir
        lng: 27.1428,
        title: "İlk Türk Amirali",
        civilization: "Çaka Beyliği",
    },
    {
        id: "suleyman_shah",
        name: "Kutalmışoğlu Süleyman Şah",
        birthYear: 1045, // Approx
        deathYear: 1086,
        activeStartYear: 1075, // Iznik conquered
        activeEndYear: 1086,
        lat: 40.43, // Iznik
        lng: 29.72,
        title: "Anadolu Selçuklu Kurucusu",
        civilization: "Anadolu Selçuklu",
    },
    {
        id: "shajar_al_durr",
        name: "Şecer-üd Dürr",
        birthYear: 1220, // Approx
        deathYear: 1257,
        activeStartYear: 1250, // Sultana of Egypt
        activeEndYear: 1257,
        lat: 30.04, // Cairo
        lng: 31.23,
        title: "Memlük Sultanı",
        civilization: "Memlûk / Eyyübi",
    },
    // --- EARLY MODERN EXPANSION (Ottoman, Safavid, Timurid extras) ---
    {
        id: "tahmasp_i",
        name: "Şah Tahmasp",
        birthYear: 1514,
        deathYear: 1576,
        activeStartYear: 1524,
        activeEndYear: 1576,
        lat: 36.26, // Qazvin
        lng: 50.0,
        title: "Şah",
        civilization: "Safevi",
    },
    {
        id: "nader_shah",
        name: "Nadir Şah",
        birthYear: 1688,
        deathYear: 1747,
        activeStartYear: 1736,
        activeEndYear: 1747,
        lat: 36.3, // Mashhad
        lng: 59.5,
        title: "Afşar Şahı",
        civilization: "Afşar",
    },
    {
        id: "kosem_sultan",
        name: "Kösem Sultan",
        birthYear: 1590, // Approx
        deathYear: 1651,
        activeStartYear: 1623, // Naib-i Saltanat
        activeEndYear: 1651,
        lat: 41.0115, // Istanbul Topkapi
        lng: 28.9833,
        title: "Valide Sultan, Naib",
        civilization: "Osmanlı",
    },
    {
        id: "hurrem_sultan",
        name: "Hürrem Sultan",
        birthYear: 1502, // Approx
        deathYear: 1558,
        activeStartYear: 1533, // Marriage to Suleiman
        activeEndYear: 1558,
        lat: 41.0115, // Istanbul Topkapi
        lng: 28.9833,
        title: "Haseki Sultan",
        civilization: "Osmanlı",
    },
    {
        id: "barbaros_hayreddin",
        name: "Barbaros Hayreddin Paşa",
        birthYear: 1478,
        deathYear: 1546,
        activeStartYear: 1516, // Algiers
        activeEndYear: 1546,
        lat: 36.75, // Algiers / Istanbul
        lng: 3.05,
        title: "Kaptan-ı Derya",
        civilization: "Osmanlı",
    },
    {
        id: "evliya_celebi",
        name: "Evliya Çelebi",
        birthYear: 1611,
        deathYear: 1682,
        activeStartYear: 1640, // Start of travels
        activeEndYear: 1682,
        lat: 41.02, // Istanbul (starting point)
        lng: 28.97,
        title: "Seyyah",
        civilization: "Osmanlı",
    },
    {
        id: "katip_celebi",
        name: "Kâtip Çelebi",
        birthYear: 1609,
        deathYear: 1657,
        activeStartYear: 1648, // Keşfü'z Zünun
        activeEndYear: 1657,
        lat: 41.01, // Istanbul
        lng: 28.96,
        title: "Bilim İnsanı, Coğrafyacı",
        civilization: "Osmanlı",
    },
    {
        id: "fuzuli",
        name: "Fuzûlî",
        birthYear: 1483, // Approx
        deathYear: 1556,
        activeStartYear: 1510,
        activeEndYear: 1556,
        lat: 32.61, // Karbala / Baghdad
        lng: 44.02,
        title: "Şair",
        civilization: "Safevi / Osmanlı",
    },
    {
        id: "ali_shir_nava_i",
        name: "Ali Şîr Nevâî",
        birthYear: 1441,
        deathYear: 1501,
        activeStartYear: 1469, // Timurid court
        activeEndYear: 1501,
        lat: 34.35, // Herat
        lng: 62.2,
        title: "Şair, Dilbilimci, Devlet Adamı",
        civilization: "Timurlu",
    },
    // --- LATE MODERN EXPANSION (19th & 20th Century) ---
    {
        id: "mustafa_kemal_ataturk",
        name: "Mustafa Kemal Atatürk",
        birthYear: 1881,
        deathYear: 1938,
        activeStartYear: 1915, // Gallipoli & War of Independence
        activeEndYear: 1938,
        lat: 39.9208, // Ankara / Turkey
        lng: 32.8541,
        title: "Kurucu Cumhurbaşkanı",
        civilization: "Türkiye Cumhuriyeti",
    },
    {
        id: "enver_pasha",
        name: "Enver Paşa",
        birthYear: 1881,
        deathYear: 1922,
        activeStartYear: 1908, // Young Turk Revolution
        activeEndYear: 1922,
        lat: 38.5, // Tajikistan / Istanbul
        lng: 68.7,
        title: "Harbiye Nazırı, Komutan",
        civilization: "Osmanlı / Basmacı Hareketi",
    },
    {
        id: "ismail_gaspirali",
        name: "İsmail Gaspıralı",
        birthYear: 1851,
        deathYear: 1914,
        activeStartYear: 1883, // Tercüman Newspaper
        activeEndYear: 1914,
        lat: 44.75, // Bakhchysarai, Crimea
        lng: 33.86,
        title: "Eğitimci, Düşünür",
        civilization: "Kırım / Rus İmparatorluğu (Türk Dünyası)",
    },
    {
        id: "sheikh_shamil",
        name: "Şeyh Şamil",
        birthYear: 1797,
        deathYear: 1871,
        activeStartYear: 1834, // Imam of Dagestan
        activeEndYear: 1859,
        lat: 42.8, // Dagestan
        lng: 46.8,
        title: "Kafkasya İmamı",
        civilization: "Kafkasya",
    },
    {
        id: "magjan_jumabaev",
        name: "Mağcan Cumabay",
        birthYear: 1893,
        deathYear: 1938,
        activeStartYear: 1917, // Alash Orda movement
        activeEndYear: 1938,
        lat: 54.8, // Petropavl, Kazakhstan
        lng: 69.1,
        title: "Şair, Yazar",
        civilization: "Alaş Orda / Kazakistan",
    },
    {
        id: "ziya_gokalp",
        name: "Ziya Gökalp",
        birthYear: 1876,
        deathYear: 1924,
        activeStartYear: 1908,
        activeEndYear: 1924,
        lat: 37.91, // Diyarbakır / Istanbul
        lng: 40.23,
        title: "Sosyolog, Yazar",
        civilization: "Osmanlı / Türkiye Cumhuriyeti",
    },
    {
        id: "mehmet_akif_ersoy",
        name: "Mehmet Akif Ersoy",
        birthYear: 1873,
        deathYear: 1936,
        activeStartYear: 1908, // Safahat
        activeEndYear: 1936,
        lat: 41.01, // Istanbul / Ankara
        lng: 28.96,
        title: "Milli Şair",
        civilization: "Osmanlı / Türkiye Cumhuriyeti",
    }
];
