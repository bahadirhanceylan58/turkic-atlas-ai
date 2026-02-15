const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const stream = fs.createReadStream(filePath);
let buffer = '';

stream.on('data', chunk => {
    buffer += chunk.toString();
    if (buffer.length > 1000000) {
        if (buffer.includes('Kangal')) {
            const index = buffer.indexOf('Kangal');
            console.log("Found 'Kangal' at index", index);
            console.log("Context:", buffer.substring(index - 100, index + 150));
            stream.destroy();
        }
        buffer = buffer.slice(-100);
    }
});

stream.on('end', () => {
    if (buffer.includes('Kangal')) {
        const index = buffer.indexOf('Kangal');
        console.log("Found 'Kangal' at index", index);
        console.log("Context:", buffer.substring(index - 100, index + 150));
    } else {
        console.log("Kangal not found.");
    }
});
