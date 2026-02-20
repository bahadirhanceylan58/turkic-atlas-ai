// lib/modernTurkicPopulations.ts

export interface TurkicPopulationPoint {
    id: string;
    name: string;
    region: string;
    country: string;
    coordinates: [number, number]; // [longitude, latitude]
    populationEstimate: number; // For heatmap weighting
    description: string;
}

export const MODERN_TURKIC_POPULATIONS: TurkicPopulationPoint[] = [
    // IRAN (South Azerbaijan & others)
    {
        id: "tebriz",
        name: "Tebriz",
        region: "Güney Azerbaycan",
        country: "İran",
        coordinates: [46.2919, 38.0792],
        populationEstimate: 2000000,
        description: "İran'daki en büyük Türki (Güney Azerbaycan) nüfus merkezi."
    },
    {
        id: "urmia",
        name: "Urmiye",
        region: "Güney Azerbaycan",
        country: "İran",
        coordinates: [45.0681, 37.5498],
        populationEstimate: 800000,
        description: "Batı Azerbaycan Eyaleti'nin başkenti, yoğun Türk nüfusuna sahip."
    },
    {
        id: "ardabil",
        name: "Erdebil",
        region: "Güney Azerbaycan",
        country: "İran",
        coordinates: [48.2936, 38.2498],
        populationEstimate: 600000,
        description: "Safevi Devleti'nin doğduğu, ağırlıklı olarak Azerbaycan Türklerinden oluşan şehir."
    },
    {
        id: "qashqai",
        name: "Şiraz (Kaşkaylar)",
        region: "Fars",
        country: "İran",
        coordinates: [52.5369, 29.5916],
        populationEstimate: 500000, // Representing the Qashqai nomads/settlers around Shiraz
        description: "İran'ın güneyinde yaşayan Kaşkay Türklerinin yoğun olarak bulunduğu bölge."
    },
    {
        id: "khorasan_turks",
        name: "Kuzey Horasan",
        region: "Horasan",
        country: "İran",
        coordinates: [57.3290, 37.4746], // Bojnord area
        populationEstimate: 400000,
        description: "İran'ın kuzeydoğusundaki Horasan Türklerinin yaşadığı bölge."
    },

    // IRAQ (Turkmeneli)
    {
        id: "kirkuk",
        name: "Kerkük",
        region: "Türkmeneli",
        country: "Irak",
        coordinates: [44.3860, 35.4674],
        populationEstimate: 700000,
        description: "Irak Türkmenlerinin tarihi ve kültürel başkenti."
    },
    {
        id: "erbil_turkmens",
        name: "Erbil",
        region: "Türkmeneli",
        country: "Irak",
        coordinates: [44.0105, 36.1901],
        populationEstimate: 200000,
        description: "Tarihi kalesi ve etrafında kadim bir Türkmen nüfusu barındıran şehir."
    },
    {
        id: "tal_afar",
        name: "Telafer",
        region: "Türkmeneli",
        country: "Irak",
        coordinates: [42.4542, 36.3768],
        populationEstimate: 250000,
        description: "Nüfusunun tamamına yakını Türkmen olan tarihi ilçe."
    },

    // SYRIA (Syrian Turkmens)
    {
        id: "aleppo_turkmens",
        name: "Halep",
        region: "Suriye Türkmenleri",
        country: "Suriye",
        coordinates: [37.1343, 36.2021],
        populationEstimate: 400000,
        description: "Suriye'deki en yoğun Türkmen nüfusunun bulunduğu tarihi bölge."
    },
    {
        id: "bayirbucak",
        name: "Bayırbucak",
        region: "Lazkiye",
        country: "Suriye",
        coordinates: [35.9525, 35.7925],
        populationEstimate: 100000,
        description: "Türkiye sınırına yakın Suriye Türkmen Dağı bölgesi."
    },

    // BALKANS
    {
        id: "komotini",
        name: "Gümülcine",
        region: "Batı Trakya",
        country: "Yunanistan",
        coordinates: [25.4042, 41.1192],
        populationEstimate: 60000,
        description: "Batı Trakya Türklerinin yoğun yaşadığı şehir."
    },
    {
        id: "xanthi",
        name: "İskeçe",
        region: "Batı Trakya",
        country: "Yunanistan",
        coordinates: [24.8872, 41.1349],
        populationEstimate: 50000,
        description: "Batı Trakya Türklerinin önemli merkezlerinden biri."
    },
    {
        id: "kardzhali",
        name: "Kırcaali",
        region: "Balkanlar",
        country: "Bulgaristan",
        coordinates: [25.3725, 41.6499],
        populationEstimate: 80000,
        description: "Bulgaristan'da Türk nüfusunun çoğunlukta olduğu şehir."
    },
    {
        id: "prizren",
        name: "Prizren",
        region: "Balkanlar",
        country: "Kosova",
        coordinates: [20.7397, 42.2139],
        populationEstimate: 25000,
        description: "Kosova'da Türk kültürünün ve nüfusunun en canlı olduğu şehir."
    },
    {
        id: "gostivar",
        name: "Gostivar",
        region: "Balkanlar",
        country: "Kuzey Makedonya",
        coordinates: [20.9080, 41.7959],
        populationEstimate: 10000,
        description: "Makedonya Türklerinin önemli yerleşim merkezlerinden."
    },
    {
        id: "constantanta_dobruja",
        name: "Köstence (Dobruca)",
        region: "Balkanlar",
        country: "Romanya",
        coordinates: [28.6348, 44.1792],
        populationEstimate: 25000,
        description: "Romanya'da tarihi Türk-Tatar nüfusunun bulunduğu Dobruca bölgesi."
    },


    // RUSSIA & CAUCASUS & CRIMEA
    {
        id: "kazan",
        name: "Kazan",
        region: "Tataristan",
        country: "Rusya",
        coordinates: [49.1221, 55.8304],
        populationEstimate: 600000,
        description: "Rusya Federasyonu içindeki Tataristan Cumhuriyeti'nin başkenti."
    },
    {
        id: "ufa",
        name: "Ufa",
        region: "Başkurdistan",
        country: "Rusya",
        coordinates: [56.0036, 54.7388],
        populationEstimate: 350000,
        description: "Başkurdistan Cumhuriyeti'nin başkenti."
    },
    {
        id: "cheboksary",
        name: "Şupaşkar (Çeboksarı)",
        region: "Çuvaşistan",
        country: "Rusya",
        coordinates: [47.2514, 56.1322],
        populationEstimate: 300000,
        description: "Hristiyan Türk halkı olan Çuvaşların başkenti."
    },
    {
        id: "gorno_altaysk",
        name: "Dağlık Altay",
        region: "Altay",
        country: "Rusya",
        coordinates: [85.9593, 51.9581],
        populationEstimate: 50000,
        description: "Türklerin ana yurdu sayılan Altay Dağları çevresindeki Altay Türkleri."
    },
    {
        id: "kyzyl",
        name: "Kızıl",
        region: "Tuva",
        country: "Rusya",
        coordinates: [94.4534, 51.7191],
        populationEstimate: 100000,
        description: "Tuva Türklerinin başkenti."
    },
    {
        id: "abakan",
        name: "Abakan",
        region: "Hakasya",
        country: "Rusya",
        coordinates: [91.4424, 53.7156],
        populationEstimate: 60000,
        description: "Hakas Türklerinin başkenti."
    },
    {
        id: "yakutsk",
        name: "Yakutsk",
        region: "Saha (Yakutistan)",
        country: "Rusya",
        coordinates: [129.7311, 62.0355],
        populationEstimate: 200000,
        description: "Dünyanın en soğuk şehri ve Saha Türklerinin (Yakutların) başkenti."
    },
    {
        id: "bakhchysarai",
        name: "Bahçesaray",
        region: "Kırım",
        country: "Ukrayna / De facto Rusya",
        coordinates: [33.8645, 44.7554],
        populationEstimate: 30000,
        description: "Kırım Tatarlarının tarihi ve kültürel beşiği."
    },
    {
        id: "makhachkala_kumyks",
        name: "Mahaçkale (Kumuk & Nogay)",
        region: "Dağıstan",
        country: "Rusya",
        coordinates: [47.5015, 42.9774],
        populationEstimate: 350000, // Representing Kumyks, Nogais, Azerbaijanis in Dagestan
        description: "Kafkasya'daki otokton Türk halkları olan Kumuklar ve Nogayların yaşadığı bölge."
    },
    {
        id: "nalchik_karachay_balkar",
        name: "Karaçay-Balkar",
        region: "Kuzey Kafkasya",
        country: "Rusya",
        coordinates: [43.6190, 43.4853], // Approx center for Karachay-Cherkessia & Kabardino-Balkaria
        populationEstimate: 350000,
        description: "Kafkas dağlarında yaşayan Karaçay ve Balkar Türkleri."
    },

    // CHINA (East Turkestan)
    {
        id: "urumqi",
        name: "Urumçi",
        region: "Doğu Türkistan",
        country: "Çin",
        coordinates: [87.6180, 43.8315],
        populationEstimate: 1000000,
        description: "Uygur Özerk Bölgesi'nin başkenti."
    },
    {
        id: "kashgar",
        name: "Kaşgar",
        region: "Doğu Türkistan",
        country: "Çin",
        coordinates: [75.9922, 39.4704],
        populationEstimate: 600000,
        description: "Divanü Lügati't-Türk'ün yazıldığı, kadim ve yoğun Uygur nüfuslu Türk-İslam şehri."
    },
    {
        id: "turpan",
        name: "Turfan",
        region: "Doğu Türkistan",
        country: "Çin",
        coordinates: [89.1764, 42.9515],
        populationEstimate: 250000,
        description: "Eski Uygur medeniyetinin izlerini taşıyan tarihi bölge."
    },
    {
        id: "hotan",
        name: "Hotan",
        region: "Doğu Türkistan",
        country: "Çin",
        coordinates: [79.9242, 37.1100],
        populationEstimate: 350000,
        description: "Tarım havzasının güneyinde yer alan önemli bir Uygur şehri."
    },

    // INDEPENDENT TURKIC COUNTRIES (Capitals and major hubs for reference weight)
    {
        id: "istanbul",
        name: "İstanbul",
        region: "Anadolu & Trakya",
        country: "Türkiye",
        coordinates: [28.9784, 41.0082],
        populationEstimate: 15000000,
        description: "" // Largest concentration
    },
    {
        id: "ankara",
        name: "Ankara",
        region: "Anadolu",
        country: "Türkiye",
        coordinates: [32.8597, 39.9334],
        populationEstimate: 5000000,
        description: ""
    },
    {
        id: "baku",
        name: "Bakü",
        region: "Kafkasya",
        country: "Azerbaycan",
        coordinates: [49.8670, 40.4093],
        populationEstimate: 2300000,
        description: ""
    },
    {
        id: "almaty",
        name: "Almatı",
        region: "Orta Asya",
        country: "Kazakistan",
        coordinates: [76.8512, 43.2220],
        populationEstimate: 2000000,
        description: ""
    },
    {
        id: "astana",
        name: "Astana",
        region: "Orta Asya",
        country: "Kazakistan",
        coordinates: [71.4284, 51.1278],
        populationEstimate: 1300000,
        description: ""
    },
    {
        id: "tashkent",
        name: "Taşkent",
        region: "Orta Asya",
        country: "Özbekistan",
        coordinates: [69.2401, 41.2995],
        populationEstimate: 2800000,
        description: ""
    },
    {
        id: "samarkand",
        name: "Semerkant",
        region: "Orta Asya",
        country: "Özbekistan",
        coordinates: [66.9597, 39.6270],
        populationEstimate: 550000,
        description: ""
    },
    {
        id: "bishkek",
        name: "Bişkek",
        region: "Orta Asya",
        country: "Kırgızistan",
        coordinates: [74.5827, 42.8746],
        populationEstimate: 1100000,
        description: ""
    },
    {
        id: "ashgabat",
        name: "Aşkabat",
        region: "Orta Asya",
        country: "Türkmenistan",
        coordinates: [58.3261, 37.9601],
        populationEstimate: 1000000,
        description: ""
    }
];

// Helper to convert array to GeoJSON FeatureCollection
export const getModernTurkicGeoJSON = (): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    return {
        type: "FeatureCollection" as const,
        features: MODERN_TURKIC_POPULATIONS.map(point => ({
            type: "Feature" as const,
            geometry: {
                type: "Point" as const,
                coordinates: point.coordinates
            },
            properties: {
                id: point.id,
                name: point.name,
                region: point.region,
                country: point.country,
                population: point.populationEstimate,
                description: point.description
            }
        }))
    };
};
