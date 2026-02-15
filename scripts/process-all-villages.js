const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '../public/data/turkey-villages-raw.json');
const districtsPath = path.join(__dirname, '../public/data/turkey-districts.json');
const destPath = path.join(__dirname, '../public/data/turkey-villages.json');

// PIP Logic (Simplified for Node.js)
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

function findDistrict(lat, lng, features) {
    for (const feature of features) {
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

try {
    console.log("Loading data...");
    const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    const districtsData = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
    const districtFeatures = districtsData.features;

    console.log(`Total raw features: ${rawData.features.length}`);

    const processedFeatures = [];
    let processedCount = 0;

    rawData.features.forEach((f, index) => {
        let name = f.properties && f.properties.name;

        // Fallback: Check @relations for label
        if (!name && f.properties && f.properties["@relations"]) {
            const relations = f.properties["@relations"];
            if (Array.isArray(relations) && relations.length > 0) {
                const labelRel = relations.find(r => r.role === "label" && r.reltags && r.reltags.name);
                if (labelRel) {
                    name = labelRel.reltags.name;
                }
            }
        }

        // Skip if still no name
        if (!name) return;

        // Skip if geometry missing
        if (!f.geometry || !f.geometry.coordinates) return;

        // Calculate centroid for point (if Polygon)
        let lat, lng;
        if (f.geometry.type === 'Point') {
            lng = f.geometry.coordinates[0];
            lat = f.geometry.coordinates[1];
        } else if (f.geometry.type === 'Polygon') {
            // Simple centroid approximation from first point of ring
            lng = f.geometry.coordinates[0][0][0];
            lat = f.geometry.coordinates[0][0][1];
            // Convert to Point for map display
            f.geometry = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        } else {
            // Skip MultiPolygon for village points for now or take first
            return;
        }

        // Find District Context
        const districtName = findDistrict(lat, lng, districtFeatures);

        // Enhance properties
        f.properties = {
            name: f.properties.name,
            ilce: districtName || 'Bilinmiyor',
            type: 'village'
        };

        processedFeatures.push(f);
        processedCount++;

        if (processedCount % 1000 === 0) console.log(`Processed ${processedCount} villages...`);
    });

    console.log(`Final village count: ${processedFeatures.length}`);

    const outputGeoJSON = {
        type: "FeatureCollection",
        features: processedFeatures
    };

    fs.writeFileSync(destPath, JSON.stringify(outputGeoJSON));
    console.log(`Saved to ${destPath}`);

} catch (err) {
    console.error("Error:", err);
}
