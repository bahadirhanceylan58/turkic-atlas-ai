const fs = require('fs');

const stream = fs.createReadStream('public/data/turkey-villages-raw.json', { start: 0, end: 2000 });

stream.on('data', (chunk) => {
    console.log(chunk.toString());
});
