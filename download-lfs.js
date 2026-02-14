const fs = require('fs');
const https = require('https');
const path = require('path');

const files = [
    {
        url: 'https://raw.githubusercontent.com/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-8.geojson',
        dest: 'public/data/turkey-villages-raw.json'
    }
];

function downloadFile(url, dest) {
    const fileStream = fs.createWriteStream(dest);
    console.log(`Downloading ${url} to ${dest}...`);

    const request = https.get(url, (response) => {
        // Handle Redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`Redirecting to ${response.headers.location}`);
            fileStream.close();
            downloadFile(response.headers.location, dest); // Recursive call
            return;
        }

        if (response.statusCode !== 200) {
            console.error(`Failed to download ${url}: Status Code ${response.statusCode}`);
            fileStream.close();
            return;
        }

        response.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Finished downloading ${dest}`);
        });
    });

    request.on('error', (err) => {
        fs.unlink(dest, () => { });
        console.error(`Error downloading ${url}: ${err.message}`);
    });
}

files.forEach(file => {
    downloadFile(file.url, path.join(__dirname, file.dest));
});
