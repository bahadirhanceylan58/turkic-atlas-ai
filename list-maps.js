const https = require('https');

const url = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/index.json';

console.log(`Fetching file list from ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            // The index.json format might be [ { year: 123, filename: "world_123.geojson" }, ... ]
            // OR just a list of files. Let's inspect it.
            const list = JSON.parse(data);
            console.log('Successfully fetched index.json');

            if (Array.isArray(list)) {
                console.log(`Found ${list.length} entries.`);
                // Sort by year if possible
                list.sort((a, b) => (a.year || 0) - (b.year || 0));

                list.forEach(entry => {
                    console.log(`Year: ${entry.year}, File: ${entry.filename}`);
                });
            } else {
                console.log('Structure:', JSON.stringify(list, null, 2).substring(0, 500));
            }

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data start:', data.substring(0, 100));
        }
    });
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
