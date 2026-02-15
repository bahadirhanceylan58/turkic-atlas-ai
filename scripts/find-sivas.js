const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const stream = fs.createReadStream(filePath, { start: 0, end: 50000000 }); // 50MB
let data = '';

stream.on('data', chunk => {
    data += chunk.toString();
    if (data.includes('Sivas')) {
        const index = data.indexOf('Sivas');
        console.log("Found 'Sivas' at index", index);
        console.log("Context:", data.substring(index - 100, index + 100));
        stream.destroy(); // Stop reading
    }
});

stream.on('end', () => {
    if (!data.includes('Sivas')) console.log("Sivas not found in first 50MB");
});
