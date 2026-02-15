const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const content = fs.readFileSync(filePath, 'utf8');
const json = JSON.parse(content);

console.log("Inspecting features without 'name' property...");

let count = 0;
for (const f of json.features) {
    if (!f.properties || !f.properties.name) {
        console.log(`\n--- Feature ${count} ---`);
        console.log(JSON.stringify(f.properties, null, 2));
        count++;
        if (count >= 5) break; // Only show first 5
    }
}

if (count === 0) {
    console.log("No features found missing 'name' property (unexpected based on previous check).");
}
