const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://media.githubusercontent.com/media/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-8.geojson';
const dest = 'public/data/turkey-villages-raw.json';

const fileStream = fs.createWriteStream(dest);
console.log(`Downloading ${url} to ${dest}...`);

https.get(url, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`Redirecting to ${response.headers.location}`);
        // Follow redirect logic if needed, but media url usually works directly or redirects once.
        // For simplicity let's just use the recursive function concept if needed, but let's see.
    }

    if (response.statusCode !== 200) {
        console.error(`Failed to download ${url}: Status Code ${response.statusCode}`);
        // If it's a redirect, we might need to handle it.
        if (response.headers.location) {
            console.log('Follow redirect manually if script fails.');
        }
        return;
    }

    response.pipe(fileStream);

    fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Finished downloading ${dest}`);
    });
}).on('error', (err) => {
    fs.unlink(dest, () => { });
    console.error(`Error downloading ${url}: ${err.message}`);
});
