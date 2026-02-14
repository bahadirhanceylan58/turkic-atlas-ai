const https = require('https');

const options = {
    hostname: 'api.github.com',
    path: '/repos/izzetkalic/geojsons-of-turkey/contents/geojsons', // Trying to list the directory
    headers: {
        'User-Agent': 'node.js'
    }
};

https.get(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const files = JSON.parse(data);
            console.log('Files in geojsons directory:');
            files.forEach(file => {
                console.log(`- ${file.name} (Download: ${file.download_url})`);
            });
        } else {
            console.error(`Failed to list directory: Status Code ${res.statusCode}`);
            console.error(data);
        }
    });
}).on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
