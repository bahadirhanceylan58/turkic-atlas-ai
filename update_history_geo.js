
const fs = require('fs');

try {
    console.log("Reading Map Data...");
    const rawGeo = JSON.parse(fs.readFileSync('public/data/raw-geo/world_1000.json', 'utf8'));
    const history = JSON.parse(fs.readFileSync('public/data/history.json', 'utf8'));

    let byzantineGeo = null;
    let kimekGeo = null;

    // Find source geometries
    for (const feature of rawGeo.features) {
        const name = feature.properties.NAME;
        if (name === 'Byzantine Empire') {
            byzantineGeo = feature.geometry;
        } else if (name === 'Kimek-Kipchak khaganate') {
            kimekGeo = feature.geometry;
        }
    }

    if (!byzantineGeo || !kimekGeo) {
        console.error("Could not find required source features in world_1000.json");
        if (!byzantineGeo) console.error("- Missing Byzantine Empire");
        if (!kimekGeo) console.error("- Missing Kimek-Kipchak khaganate");
        // process.exit(1); // Proceed with what we have? No, critical.
    }

    // Update history.json
    let updates = 0;
    for (const feature of history.features) {
        const name = feature.properties.name;

        if (name === 'Republic of Turkey' && byzantineGeo) {
            console.log("Updating Republic of Turkey with Byzantine Empire geometry (High-Res Proxy)");
            feature.geometry = byzantineGeo;
            updates++;
        }

        if (name === 'Gokturk Khaganate' && kimekGeo) {
            console.log("Updating Gokturk Khaganate with Kimek-Kipchak geometry (High-Res Proxy)");
            feature.geometry = kimekGeo;
            updates++;
        }
    }

    if (updates > 0) {
        fs.writeFileSync('public/data/history.json', JSON.stringify(history, null, 2));
        console.log(`Successfully updated ${updates} features in history.json`);
    } else {
        console.log("No features updated (targets not found in history.json?)");
    }

} catch (e) {
    console.error("Error:", e);
}
