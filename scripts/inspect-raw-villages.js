const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');

if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    process.exit(1);
}

// Read small chunk to avoid memory issues with huge file
const stream = fs.createReadStream(filePath, { start: 0, end: 5000 });
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => {
    console.log(data.substring(0, 2000));
});
