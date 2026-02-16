const https = require('https');

const files = ['world_500.geojson', 'world_600.geojson', 'world_700.geojson', 'world_bc500.geojson'];
const keywords = ['turk', 'tou-kiue', 'tujue', 'khaganate', 'saka', 'scyth', 'massagetae', 'hun', 'xiongnu'];

async function checkFile(filename) {
    return new Promise((resolve) => {
        const url = `https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/${filename}`;
        console.log(`\nChecking ${filename}...`);

        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const geojson = JSON.parse(data);
                    console.log(`Total features: ${geojson.features.length}`);

                    const matches = geojson.features.filter(f => {
                        const props = JSON.stringify(f.properties).toLowerCase();
                        return keywords.some(k => props.includes(k));
                    });

                    if (matches.length > 0) {
                        console.log(`✅ Found ${matches.length} matches:`);
                        matches.forEach(m => console.log(` - ${m.properties.NAME || m.properties.name || 'Unnamed'} (${Object.keys(m.properties).join(',')})`));
                    } else {
                        console.log('❌ No matches found.');
                        // Print first 5 valid names to check encoding/style
                        const validNames = geojson.features.map(f => f.properties.NAME || f.properties.name).filter(n => n).slice(0, 5);
                        console.log('Sample names:', validNames.join(', '));
                    }
                    resolve();
                } catch (e) { console.error(e); resolve(); }
            });
        }).on('error', () => resolve());
    });
}

async function run() {
    for (const f of files) await checkFile(f);
}

run();
