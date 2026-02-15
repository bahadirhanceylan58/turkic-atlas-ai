const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ HATA: .env.local anahtarları bulunamadı!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAndUploadVillages() {
    console.log("🦅 Sivas köyleri aranıyor (OpenStreetMap)...");
    // Sivas merkezi (39.75, 37.01) etrafında 150km çap
    // Fetch villages, towns, and cities
    const overpassQuery = `[out:json];(node["place"~"village|town|city"](around:150000, 39.7505, 37.0142););out body;`;

    try {
        const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: overpassQuery } });
        const places = response.data.elements;
        console.log(`✅ ${places.length} yerleşim yeri bulundu. Yükleniyor...`);

        const rowsToInsert = places.map(v => {
            let type = 'village';
            if (v.tags.place === 'town' || v.tags.place === 'city') type = 'city';

            return {
                name: v.tags.name || "İsimsiz",
                lat: v.lat,
                lng: v.lon,
                type: type,
                // year: 2024 (Removed as column missing)
                historical_data: { source: "OSM", osm_id: v.id, original_type: v.tags.place, year: 2024 }
            };
        });

        for (let i = 0; i < rowsToInsert.length; i += 50) {
            const { error } = await supabase.from('places').insert(rowsToInsert.slice(i, i + 50));
            if (error) console.error("Hata:", error.message);
            else console.log(`📦 ${Math.min(i + 50, rowsToInsert.length)} / ${rowsToInsert.length} yüklendi...`);
        }
        console.log("🎉 İŞLEM TAMAM!");
    } catch (e) { console.error("Hata:", e.message); }
}
fetchAndUploadVillages();
