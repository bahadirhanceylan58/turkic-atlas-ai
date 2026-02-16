const https = require('https');

const filenames = [
    'world_bc323', 'world_-323', 'world_bc500', 'world_-500',
    'world_bc1000', 'world_-1000', 'world_bc2000', 'world_-2000',
    'world_1', 'world_0'
];

const baseUrl = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/';

console.log('Probing for BC maps...');

let completed = 0;

filenames.forEach(name => {
    const url = `${baseUrl}${name}.geojson`;

    const req = https.request(url, { method: 'HEAD' }, (res) => {
        if (res.statusCode === 200) {
            console.log(`[FOUND] ${name}.geojson`);
        } else {
            // console.log(`[MISSING] ${name}.geojson`);
        }
        completed++;
        if (completed === filenames.length) console.log('Probing complete.');
    });

    req.on('error', () => {
        completed++;
        if (completed === filenames.length) console.log('Probing complete.');
    });

    req.end();
});
