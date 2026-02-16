const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1600.geojson';
const dest = path.join(__dirname, 'temp_world_1600.json');
const historyPath = path.join(__dirname, 'public/data/history.json');

console.log(`Downloading ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const geojson = JSON.parse(data);
            console.log(`Downloaded. Total features: ${geojson.features.length}`);

            // Find Ottoman Empire
            // The property might be 'NAME', 'Name', 'sovereignt' etc.
            // Let's inspect the first feature to see properties
            if (geojson.features.length > 0) {
                console.log('Sample properties:', JSON.stringify(geojson.features[0].properties, null, 2));
            }

            // Attempt to find Ottoman
            const ottoman = geojson.features.find(f =>
                (f.properties.NAME && f.properties.NAME.includes('Ottoman')) ||
                (f.properties.name && f.properties.name.includes('Ottoman')) ||
                (f.properties.sovereignt && f.properties.sovereignt.includes('Ottoman'))
            );

            if (ottoman) {
                console.log('Found Ottoman Empire feature!');

                // Read history.json
                const historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

                // Update Ottoman geometry
                let updated = false;
                historyData.features = historyData.features.map(f => {
                    if (f.properties.name === 'Ottoman Empire') {
                        console.log('Updating Ottoman Empire geometry in history.json...');
                        f.geometry = ottoman.geometry;
                        updated = true;
                    }
                    return f;
                });

                if (updated) {
                    fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2));
                    console.log('Successfully updated history.json!');
                } else {
                    console.error('Could not find "Ottoman Empire" in history.json to update.');
                }

            } else {
                console.log('Could not find a feature matching "Ottoman" in the downloaded file.');
                // List some names to help debugging
                console.log('Available names:', geojson.features.slice(0, 20).map(f => f.properties.NAME || f.properties.name).join(', '));
            }

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
