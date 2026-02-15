const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');

const stream = fs.createReadStream(filePath, { start: 0, end: 100000 }); // Read 100KB
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => {
    // Find all "properties": { ... } blocks
    const regex = /"properties"\s*:\s*({[^}]+})/g;
    let match;
    let count = 0;
    while ((match = regex.exec(data)) !== null && count < 5) {
        console.log(`[${count}]`, match[1]);
        count++;
    }
});
