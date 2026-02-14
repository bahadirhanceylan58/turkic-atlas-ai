const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'public/data/turkey-villages-raw.json');
const destPath = path.join(__dirname, 'public/data/sivas-villages.json');

try {
    console.log('Reading raw file...');
    const rawData = fs.readFileSync(rawPath, 'utf8');
    const geojson = JSON.parse(rawData);

    console.log(`Total features: ${geojson.features.length}`);

    // The raw file has networks like "TR58-Sivas-köyleri". Maybe capitalization or spacing issues?
    // Let's print unique networks to debug.

    const networks = new Set();
    geojson.features.forEach(f => {
        if (f.properties.network) networks.add(f.properties.network);
    });

    console.log("Networks found:", Array.from(networks));

    const sivasFeatures = geojson.features.filter(f => {
        const props = f.properties || {};
        const network = props.network || '';

        // Check various patterns for Sivas
        if (network.toLowerCase().includes('sivas') || network.includes('TR58')) {
            return true;
        }
        return false;
    });

    console.log(`Found ${sivasFeatures.length} Sivas village features.`);

    const sivasGeoJSON = {
        type: "FeatureCollection",
        features: sivasFeatures
    };

    fs.writeFileSync(destPath, JSON.stringify(sivasGeoJSON));
    console.log('Saved to ' + destPath);

} catch (err) {
    console.error('Error:', err);
}
