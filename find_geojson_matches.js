
const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('public/data/raw-geo/world_1000.json', 'utf8'));
    const keywords = ['Byzant', 'Roman', 'Seljuk', 'Ghazn', 'Qarakh', 'Karakh', 'Kimek', 'Kimak', 'Kipchak', 'Pecheneg', 'Peshemeg', 'Uyghur', 'Uigur', 'Khazar', 'Bulgar', 'Turk'];

    const matches = new Set();

    if (data.features) {
        data.features.forEach(feature => {
            const name = feature.properties.NAME;
            if (name) {
                if (keywords.some(k => name.includes(k))) {
                    matches.add(name);
                }
            }
        });
    }

    console.log("Matched names:");
    Array.from(matches).sort().forEach(n => console.log(`- ${n}`));

} catch (e) {
    console.error("Error:", e);
}
