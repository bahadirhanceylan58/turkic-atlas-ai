const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/sivas-villages.json');

if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    console.log("Features found:", json.features.length);
    json.features.forEach(f => console.log(f.properties.name));
} else {
    console.log("File not found.");
}
