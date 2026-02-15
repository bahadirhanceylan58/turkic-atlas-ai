const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const content = fs.readFileSync(filePath, 'utf8');
const json = JSON.parse(content);

let missingNameCount = 0;
json.features.forEach((f, i) => {
    if (!f.properties || !f.properties.name) {
        missingNameCount++;
        if (missingNameCount < 5) console.log(`Feature ${i} missing name.`);
    }
});

console.log(`Total features with missing name: ${missingNameCount}`);
console.log(`Total features: ${json.features.length}`);
