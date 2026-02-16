const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public/data/historical_maps');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/';

// Years to download (based on what we know exists + some critical ones)
const files = [
    'world_bc2000.geojson', 'world_bc1000.geojson', 'world_bc500.geojson',
    'world_bc323.geojson', 'world_bc200.geojson', 'world_1.geojson',
    'world_100.geojson', 'world_200.geojson', 'world_300.geojson',
    'world_400.geojson', 'world_500.geojson', 'world_600.geojson',
    'world_700.geojson', 'world_800.geojson', 'world_900.geojson',
    'world_1000.geojson', 'world_1100.geojson', 'world_1200.geojson',
    'world_1300.geojson', 'world_1400.geojson', 'world_1500.geojson',
    'world_1600.geojson', 'world_1700.geojson', 'world_1800.geojson',
    'world_1900.geojson', 'world_1994.geojson'
];

async function downloadFile(filename) {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}${filename}`;
        const destPath = path.join(targetDir, filename);

        console.log(`Downloading ${filename}...`);

        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.warn(`❌ Failed to download ${filename} (Status: ${response.statusCode})`);
                fs.unlink(destPath, () => { }); // Delete empty file
                resolve(); // unexpected error but continue
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`✅ Saved ${filename}`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => { });
            console.error(`Error downloading ${filename}: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log(`Downloading maps to ${targetDir}...`);
    for (const f of files) {
        await downloadFile(f);
    }
    console.log('All downloads complete.');
}

run();
