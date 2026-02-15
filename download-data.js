const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'public/data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const files = [
    {
        url: 'https://raw.githubusercontent.com/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-4.geojson',
        dest: 'turkey-provinces.json',
        description: 'Turkey Provinces (Level 4)'
    },
    {
        url: 'https://raw.githubusercontent.com/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-6.geojson',
        dest: 'turkey-districts.json',
        description: 'Turkey Districts (Level 6)'
    },
    {
        url: 'https://media.githubusercontent.com/media/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-8.geojson',
        dest: 'turkey-villages-raw.json',
        description: 'Turkey Villages Raw (Level 8) - HUGE FILE'
    }
];

function downloadFile(file) {
    return new Promise((resolve, reject) => {
        const destPath = path.join(DATA_DIR, file.dest);

        // Skip if file exists and is larger than 0 bytes (simple check)
        // For Vercel, we can force download or just check existence. 
        // Vercel cache might keep files, so existence check is good.
        if (fs.existsSync(destPath)) {
            const stats = fs.statSync(destPath);
            if (stats.size > 1000) {
                console.log(`[SKIP] ${file.dest} already exists (${(stats.size / 1024 / 1024).toFixed(2)} MB).`);
                resolve();
                return;
            }
        }

        const fileStream = fs.createWriteStream(destPath);
        console.log(`[DOWNLOAD] Starting ${file.dest} from ${file.url}...`);

        const request = https.get(file.url, (response) => {
            // Handle Redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(`[REDIRECT] ${file.dest} -> ${response.headers.location}`);
                fileStream.close();
                downloadFile({ ...file, url: response.headers.location }).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                console.error(`[ERROR] Failed to download ${file.dest}: Status Code ${response.statusCode}`);
                fileStream.close();
                fs.unlink(destPath, () => { }); // Clean up empty file
                // Don't reject, just warn, so build doesn't fail if one file is missing (unless critical)
                // But these ARE critical for the map. Let's resolve but log error.
                resolve();
                return;
            }

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`[SUCCESS] Finished ${file.dest}`);
                resolve();
            });
        });

        request.on('error', (err) => {
            fs.unlink(destPath, () => { });
            console.error(`[ERROR] Network error for ${file.dest}: ${err.message}`);
            resolve(); // Resolve to allow other downloads to proceed
        });
    });
}

async function filterSivasVillages() {
    const rawPath = path.join(DATA_DIR, 'turkey-villages-raw.json');
    const destPath = path.join(DATA_DIR, 'sivas-villages.json');

    if (!fs.existsSync(rawPath)) {
        console.log('[WARN] Raw village file not found, skipping Sivas filter.');
        return;
    }

    // Skip if Sivas file already exists and is reasonably large (e.g. > 1KB)
    if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 1024) {
            console.log(`[SKIP] sivas-villages.json already exists (${(stats.size / 1024).toFixed(2)} KB).`);
            return;
        }
    }

    try {
        console.log('[PROCESSING] Filtering Sivas villages...');
        // Use a streaming approach or read safely if file size allows (100MB is fine for Node usually)
        // But let's stick to readFileSync for simplicity if it works.
        const rawData = fs.readFileSync(rawPath, 'utf8');
        const geojson = JSON.parse(rawData);

        const sivasFeatures = [];

        geojson.features.forEach(f => {
            const props = f.properties || {};
            const network = props.network || '';

            // Expected format: "TR58-DistrictName-köyleri" or similar
            if (network.includes('TR58') || network.toLowerCase().includes('sivas')) {
                // Extract district if possible
                let district = 'Merkez'; // Default
                const parts = network.split('-');
                if (parts.length >= 2) {
                    // Start from index 1 (TR58 is index 0 usually)
                    // Example: TR58-Kangal-köyleri -> Kangal
                    // Example: TR58-Sivas-Merkez-köyleri -> Sivas-Merkez?
                    // Let's take the part after TR58
                    const districtPart = parts.find(p => p !== 'TR58' && !p.includes('köyleri') && !p.includes('TR'));
                    if (districtPart) {
                        district = districtPart;
                    }
                }

                // Add inferred properties
                f.properties.ilce = district;
                f.properties.city = 'Sivas';

                sivasFeatures.push(f);
            }
        });

        console.log(`[SUCCESS] Found ${sivasFeatures.length} Sivas village features.`);

        const sivasGeoJSON = {
            type: "FeatureCollection",
            features: sivasFeatures
        };

        fs.writeFileSync(destPath, JSON.stringify(sivasGeoJSON));
        console.log('[SUCCESS] Saved sivas-villages.json');

    } catch (err) {
        console.error('[ERROR] Failed to filter Sivas villages:', err.message);
    }
}

async function downloadAll() {
    console.log('--- Starting Map Data Download ---');
    for (const file of files) {
        await downloadFile(file);
    }

    // Post-processing
    await filterSivasVillages();

    console.log('--- Download & Processing Complete ---');
}

downloadAll();
