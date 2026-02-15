const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/sivas-villages.json');

const content = fs.readFileSync(filePath, 'utf8');
const json = JSON.parse(content);

if (json.features && json.features.length > 20) {
    console.log("Features 20-25 properties:");
    json.features.slice(20, 25).forEach((f, i) => {
        console.log(`[${20 + i}]`, JSON.stringify(f.properties, null, 2));
    });
} else {
    console.log("Not enough features.");
}
