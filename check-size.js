const https = require('https');

const url = 'https://raw.githubusercontent.com/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-8.geojson';

const req = https.request(url, { method: 'HEAD' }, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
