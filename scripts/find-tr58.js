const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const stream = fs.createReadStream(filePath);
let buffer = '';

stream.on('data', chunk => {
    buffer += chunk.toString();
    // Keep buffer size manageable, but ensure we don't cut a keyword in half
    if (buffer.length > 1000000) {
        if (buffer.includes('TR58')) {
            const index = buffer.indexOf('TR58');
            console.log("Found 'TR58' at index", index);
            console.log("Context:", buffer.substring(index - 50, index + 150));
            stream.destroy();
        }
        // Keep last 100 chars for overlap
        buffer = buffer.slice(-100);
    }
});

stream.on('end', () => {
    if (buffer.includes('TR58')) {
        const index = buffer.indexOf('TR58');
        console.log("Found 'TR58' at index", index);
        console.log("Context:", buffer.substring(index - 50, index + 150));
    } else {
        console.log("TR58 not found.");
    }
});
