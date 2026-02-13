
const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('public/data/raw-geo/world_1000.json', 'utf8'));
    const names = [];

    if (data.features) {
        data.features.forEach(feature => {
            if (feature.properties && feature.properties.NAME) {
                names.push(feature.properties.NAME);
            }
        });
    }

    console.log("Found names:");
    names.sort().forEach(n => console.log(`- ${n}`));

} catch (e) {
    console.error("Error:", e);
}
