const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-districts.json');

// Read small chunk to avoid memory issues
const stream = fs.createReadStream(filePath, { start: 0, end: 5000 });
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => {
    // Find first "properties": { ... }
    const regex = /"properties"\s*:\s*({[^}]+})/g;
    const match = regex.exec(data);
    if (match) {
        console.log("District Properties:", match[1]);
    } else {
        console.log("Could not find properties in first 5KB.");
    }
});
