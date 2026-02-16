const https = require('https');
const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, 'public/data/history.json');
const baseUrl = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/';

// Mappings: State Name in history.json -> { yearFile, searchNames }
const mappings = [
    {
        stateName: 'Scythians (Saka)',
        file: 'world_bc323.geojson', // Alexander era might have Saka/Scythians
        fallbackFile: 'world_bc200.geojson',
        search: ['Saka', 'Scythia', 'Scythians', 'Skudra', 'Massagetae', 'Dahae']
    },
    {
        stateName: 'Xiongnu (Asian Huns)',
        file: 'world_bc200.geojson',
        search: ['Xiongnu', 'Hsiung-nu', 'Hun', 'Hiung-nu']
    },
    {
        stateName: 'Gokturk Khaganate',
        file: 'world_700.geojson', // 600 had no names, 700 has Western Gokturk
        search: ['Gokturk', 'Turk', 'Tou-kiue', 'Tujue', 'Turkic Khaganate', 'Western Gokturk', 'Eastern Gokturk']
    },
    {
        stateName: 'Great Seljuk Empire',
        file: 'world_1100.geojson',
        search: ['Seljuk', 'Seljuq', 'Great Seljuk', 'Saljuq']
    },
    {
        stateName: 'Ottoman Empire',
        file: 'world_1600.geojson',
        search: ['Ottoman', 'Osmanli']
    }
];

// Helper to download json
function downloadJson(filename) {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}${filename}`;
        console.log(`Downloading ${filename}...`);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // Try fallback if needed, but for now just reject
                if (res.statusCode === 404) {
                    console.log(`File not found: ${filename}`);
                    resolve(null); // Return null to skip
                    return;
                }
                return reject(new Error(`Status ${res.statusCode}`));
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function run() {
    let history;
    try {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    } catch (e) {
        console.error('Failed to read history.json', e);
        return;
    }

    for (const map of mappings) {
        console.log(`\nProcessing ${map.stateName}...`);

        let geojson = await downloadJson(map.file);
        if (!geojson && map.fallbackFile) {
            console.log(`Trying fallback: ${map.fallbackFile}...`);
            geojson = await downloadJson(map.fallbackFile);
        }

        if (!geojson) {
            console.log(`Skipping ${map.stateName} (no map data).`);
            continue;
        }

        // Search for feature
        let matchedFeature = null;

        // 1. Exact Name Matches first
        matchedFeature = geojson.features.find(f => {
            const name = f.properties.NAME || f.properties.name || f.properties.Name || f.properties.sovereignt || "";
            return map.search.some(s => name.toLowerCase() === s.toLowerCase());
        });

        // 2. Contains Match
        if (!matchedFeature) {
            matchedFeature = geojson.features.find(f => {
                const name = f.properties.NAME || f.properties.name || f.properties.Name || f.properties.sovereignt || "";
                return map.search.some(s => name.toLowerCase().includes(s.toLowerCase()));
            });
        }

        if (matchedFeature) {
            const foundName = matchedFeature.properties.NAME || matchedFeature.properties.name;
            console.log(`✅ Found match: "${foundName}" in ${map.file || map.fallbackFile}`);

            // Update history.json
            const target = history.features.find(f => f.properties.name === map.stateName);
            if (target) {
                target.geometry = matchedFeature.geometry;
                console.log(`Updated geometry for ${map.stateName}`);
            } else {
                console.error(`Creating new feature not supported yet, but ${map.stateName} should exist.`);
            }
        } else {
            console.warn(`❌ No match found for [${map.search.join(', ')}] in ${map.file}`);
            // List some names to help debug
            const sampleNames = geojson.features.slice(0, 10).map(f => f.properties.NAME || f.properties.name).join(', ');
            console.log(`Sample names in file: ${sampleNames}...`);
        }
    }

    console.log('\nSaving history.json...');
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log('Done.');
}

run();
