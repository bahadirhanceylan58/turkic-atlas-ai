const fs = require('fs');
const path = require('path');

const districtsPath = path.join(__dirname, '../public/data/turkey-districts.json');
const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));

// Minimal PIP implementation for verification
function isPointInPolygon(point, vs) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function findDistrict(lat, lng, geojson) {
    for (const feature of geojson.features) {
        const geometry = feature.geometry;
        if (!geometry) continue;

        if (geometry.type === 'Polygon') {
            const rings = geometry.coordinates;
            if (rings.length > 0 && isPointInPolygon([lng, lat], rings[0])) {
                return feature.properties.name;
            }
        } else if (geometry.type === 'MultiPolygon') {
            const polygons = geometry.coordinates;
            for (const rings of polygons) {
                if (rings.length > 0 && isPointInPolygon([lng, lat], rings[0])) {
                    return feature.properties.name;
                }
            }
        }
    }
    return null;
}

// Çetinkaya Coordinates
const lat = 39.2510206;
const lng = 37.6073206;

console.log(`Testing coordinates: ${lat}, ${lng}`);
const district = findDistrict(lat, lng, districts);
console.log(`Resolved District: ${district}`);
