export interface TurkicTribePoint {
    id: string;
    name: string; // e.g., "Kayseri/Pınarbaşı Avşarları"
    tribe: string; // The specific boy/tribe name, e.g., "Avşar", "Kayı", "Kınık"
    branch: string; // e.g., "Bozok", "Üçok"
    country: string; // e.g., "Türkiye", "İran"
    region: string; // The state/province, e.g., "Kayseri"
    coordinates: [number, number]; // [longitude, latitude]
    color: string; // Hex color code for map rendering
    description: string; // Short bio/info about this specific settlement
}

export const TURKIC_TRIBES_DATA: TurkicTribePoint[] = [
    // --- AVŞAR (AFSHAR) TRIBE ---
    // TURKEY
    {
        id: "avsar-kayseri-1",
        name: "Pınarbaşı Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Kayseri",
        coordinates: [36.0844, 38.7230], // Example approx coordinate
        color: "#b91c1c", // Deep red (similar to the map provided)
        description: "Kayseri Pınarbaşı ve çevresi, Dadaloğlu'nun da yetiştiği en yoğun Avşar Türkmen yerleşimlerinden biridir."
    },
    {
        id: "avsar-adana-1",
        name: "Çukurova Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Adana",
        coordinates: [35.3213, 37.0000], // Example approx coordinate
        color: "#b91c1c",
        description: "Toroslar ve Çukurova havzası, Osmanlı döneminde iskan edilen Avşar obalarının yoğunluklu bölgesidir."
    },
    {
        id: "avsar-sivas-1",
        name: "Sivas Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Sivas",
        coordinates: [37.0150, 39.7505], // Example approx coordinate
        color: "#b91c1c",
        description: "Sivas'ın güney ilçeleri ve köyleri ciddi bir Avşar nüfusu barındırır."
    },
    {
        id: "avsar-karaman-1",
        name: "Karaman Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Türkiye",
        region: "Karaman",
        coordinates: [33.2185, 37.1811], // Example approx coordinate
        color: "#b91c1c",
        description: "Karamanoğulları döneminden beri süregelen köklü Avşar yerleşimleri."
    },

    // IRAN
    {
        id: "avsar-urmia-1",
        name: "Urmiye Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Güney Azerbaycan",
        coordinates: [45.0760, 37.5527],
        color: "#b91c1c",
        description: "Tarihi Afşar Hanedanı'nın da (Nadir Şah) temellerinin dayandığı, Urmiye Gölü çevresindeki devasa Avşar (Afşar) nüfusu."
    },
    {
        id: "avsar-khorasan-1",
        name: "Horasan Afşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "İran",
        region: "Horasan",
        coordinates: [59.6062, 36.2972], // Near Mashhad
        color: "#b91c1c",
        description: "Safeviler döneminde sınırları korumak amacıyla Horasan bölgesine yerleştirilen savaşçı Afşar boyları."
    },

    // SYRIA
    {
        id: "avsar-syria-1",
        name: "Halep Avşarları",
        tribe: "Avşar",
        branch: "Bozok",
        country: "Suriye",
        region: "Halep",
        coordinates: [37.1343, 36.2021],
        color: "#b91c1c",
        description: "Suriye (Halep-Bayırbucak) hattında yaşayan Türkmen nüfusu içerisinde önemli bir Avşar kolu bulunur."
    }
];

// Helper to extract unique tribes for filtering in the UI
export const getUniqueTribes = (): string[] => {
    const tribes = TURKIC_TRIBES_DATA.map(t => t.tribe);
    return Array.from(new Set(tribes));
};

// Helper to convert to GeoJSON for Mapbox
export const getTurkicTribesGeoJSON = (filterTribe?: string): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const filteredData = filterTribe
        ? TURKIC_TRIBES_DATA.filter(t => t.tribe === filterTribe)
        : TURKIC_TRIBES_DATA;

    return {
        type: "FeatureCollection" as const,
        features: filteredData.map(point => ({
            type: "Feature" as const,
            geometry: {
                type: "Point" as const,
                coordinates: point.coordinates
            },
            properties: {
                id: point.id,
                name: point.name,
                tribe: point.tribe,
                branch: point.branch,
                country: point.country,
                region: point.region,
                color: point.color,
                description: point.description,
                type: 'turkic_tribe' // Helper for the Map Component click handler
            }
        }))
    };
};
