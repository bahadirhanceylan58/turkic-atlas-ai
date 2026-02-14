const fs = require('fs');
const https = require('https');
const path = require('path');

const files = [
    {
        url: 'https://media.githubusercontent.com/media/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-4.geojson',
        dest: 'public/data/turkey-provinces.json'
    },
    {
        url: 'https://media.githubusercontent.com/media/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-6.geojson',
        dest: 'public/data/turkey-districts.json'
    }
];

files.forEach(file => {
    const filePath = path.join(__dirname, file.dest);
    const fileStream = fs.createWriteStream(filePath);

    console.log(`Downloading ${file.url} to ${filePath}...`);

    https.get(file.url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download ${file.url}: Status Code ${response.statusCode}`);
            return;
        }

        response.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Finished downloading ${file.dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(filePath, () => { });
        console.error(`Error downloading ${file.url}: ${err.message}`);
    });
});
