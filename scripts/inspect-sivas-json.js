const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/sivas-villages.json');

if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const json = JSON.parse(content);

if (json.features && json.features.length > 0) {
    console.log("First 3 features properties:");
    json.features.slice(0, 3).forEach((f, i) => {
        console.log(`[${i}]`, JSON.stringify(f.properties, null, 2));
    });
} else {
    console.log("No features found or empty file.");
}
