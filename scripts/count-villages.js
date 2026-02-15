const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/turkey-villages-raw.json');

// Using stream to avoid memory issues if file is huge (though 60MB is okay for Node)
const stream = fs.createReadStream(filePath);
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => {
    try {
        const json = JSON.parse(data);
        if (json.features) {
            console.log(`Total features: ${json.features.length}`);
            // Sample first and last to verify
            console.log("First:", json.features[0].properties.name);
            console.log("Last:", json.features[json.features.length - 1].properties.name);
        } else {
            console.log("No features array found.");
        }
    } catch (err) {
        console.error("Error parsing JSON:", err.message);
    }
});
