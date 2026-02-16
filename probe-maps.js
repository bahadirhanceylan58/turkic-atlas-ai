const https = require('https');

const years = [
    '-2000', '-1000', '-500', '-323', '-200', '1', '100', '200', '300', '400', '500',
    '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1453', '1500',
    '1600', '1700', '1800', '1900', '1914', '1938', '1945', '1994'
];

const baseUrl = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_';

console.log('Probing for available maps...');

let completed = 0;

years.forEach(year => {
    const url = `${baseUrl}${year}.geojson`;

    const req = https.request(url, { method: 'HEAD' }, (res) => {
        if (res.statusCode === 200) {
            console.log(`[FOUND] ${year}`);
        }
        completed++;
        if (completed === years.length) console.log('Probing complete.');
    });

    req.on('error', () => {
        // console.log(`[ERROR] ${year}`);
        completed++;
        if (completed === years.length) console.log('Probing complete.');
    });

    req.end();
});
