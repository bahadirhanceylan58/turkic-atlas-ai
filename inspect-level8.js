const https = require('https');

const url = 'https://raw.githubusercontent.com/izzetkalic/geojsons-of-turkey/master/geojsons/turkey-admin-level-8.geojson';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data); // Print the content
    });
}).on('error', (e) => {
    console.error(e);
});
