const https = require('https');
const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, 'public/data/history.json');

async function downloadJson(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

    // 1. Merge Gokturks (700 AD)
    console.log('Downloading world_700.geojson for Gokturk merge...');
    const world700 = await downloadJson('https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_700.geojson');

    if (world700) {
        const gokturks = world700.features.filter(f => {
            const name = (f.properties.NAME || f.properties.name || "").toLowerCase();
            return name.includes('gokturk') || name.includes('turkic khaganate');
        });

        console.log(`Found ${gokturks.length} Gokturk features.`);

        if (gokturks.length > 0) {
            // Merge geometries
            // If they are Polygons, we make a MultiPolygon. If MultiPolygon, we combine coordinates.
            let mergedCoords = [];

            gokturks.forEach(f => {
                const type = f.geometry.type;
                const coords = f.geometry.coordinates;

                if (type === 'Polygon') {
                    mergedCoords.push(coords); // Add as a polygon to the multipolygon list
                } else if (type === 'MultiPolygon') {
                    coords.forEach(poly => mergedCoords.push(poly));
                }
            });

            // Find Gokturk in history.json
            const target = history.features.find(f => f.properties.name === 'Gokturk Khaganate');
            if (target) {
                target.geometry = {
                    type: 'MultiPolygon',
                    coordinates: mergedCoords
                };
                console.log('Merged Gokturk geometry updated.');
            }
        }
    }

    // 2. Check Scythians in world_bc200
    console.log('\nChecking Scythians in world_bc200.geojson...');
    const worldBc200 = await downloadJson('https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_bc200.geojson');
    if (worldBc200) {
        const scythians = worldBc200.features.find(f => {
            const name = (f.properties.NAME || f.properties.name || "").toLowerCase();
            return name.includes('saka') || name.includes('scyth') || name.includes('dahae');
        });

        if (scythians) {
            console.log(`Found Scythian/Saka match: ${scythians.properties.NAME}`);
            const target = history.features.find(f => f.properties.name === 'Scythians (Saka)');
            if (target) {
                target.geometry = scythians.geometry;
                console.log('Scythian geometry updated.');
            }
        } else {
            console.log('Scythians not found in bc200.');
        }
    }

    // Save
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log('history.json saved.');
}

run();
