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
    const overpassQuery = `[out:json];(node["place"="village"](around:150000, 39.7505, 37.0142););out body;`;

    try {
        const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: overpassQuery } });
        const villages = response.data.elements;
        console.log(`✅ ${villages.length} köy bulundu. Yükleniyor...`);

        const rowsToInsert = villages.map(v => ({
            name: v.tags.name || "İsimsiz",
            location: `POINT(${v.lon} ${v.lat})`,
            type: 'village',
            historical_data: { source: "OSM", province: "Sivas", osm_id: v.id }
        }));

        for (let i = 0; i < rowsToInsert.length; i += 50) {
            const { error } = await supabase.from('places').insert(rowsToInsert.slice(i, i + 50));
            if (error) console.error("Hata:", error.message);
            else console.log(`📦 ${Math.min(i + 50, rowsToInsert.length)} / ${rowsToInsert.length} yüklendi...`);
        }
        console.log("🎉 İŞLEM TAMAM!");
    } catch (e) { console.error("Hata:", e.message); }
}
fetchAndUploadVillages();
