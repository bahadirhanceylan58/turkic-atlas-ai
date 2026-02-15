const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const stream = fs.createReadStream(filePath);
let buffer = '';
const networks = new Set();

stream.on('data', chunk => {
    buffer += chunk.toString();
    const regex = /"network"\s*:\s*"([^"]*TR58[^"]*)"/g;
    let match;
    while ((match = regex.exec(buffer)) !== null) {
        networks.add(match[1]);
    }
    // Keep last 1000 chars for overlap
    buffer = buffer.slice(-1000);
});

stream.on('end', () => {
    console.log("Unique TR58 networks:");
    networks.forEach(n => console.log(n));
});
