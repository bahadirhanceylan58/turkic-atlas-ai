
export interface GeoJSONFeature {
    type: "Feature";
    properties: {
        name: string;
        [key: string]: any;
    };
    geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: any[];
    };
}

export interface GeoJSONCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

/**
 * Checks if a point is inside a polygon using ray casting algorithm.
 */
function isPointInPolygon(point: [number, number], vs: [number, number][]): boolean {
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

/**
 * Finds the district name for a given lat/lng from a GeoJSON collection.
 */
export function findDistrict(lat: number, lng: number, geojson: GeoJSONCollection): string | null {
    if (!geojson || !geojson.features) return null;

    for (const feature of geojson.features) {
        const geometry = feature.geometry;
        if (!geometry) continue;

        if (geometry.type === 'Polygon') {
            // Polygon has linear rings. The first is the exterior ring.
            // Coordinate format: [ [ [lng, lat], ... ] ]
            const rings = geometry.coordinates;
            // Check outer ring (index 0)
            if (rings.length > 0 && isPointInPolygon([lng, lat], rings[0] as [number, number][])) {
                return feature.properties.name;
            }
        } else if (geometry.type === 'MultiPolygon') {
            // MultiPolygon: [ [ [lng, lat], ... ], ... ]
            const polygons = geometry.coordinates;
            for (const rings of polygons) {
                if (rings.length > 0 && isPointInPolygon([lng, lat], rings[0] as [number, number][])) {
                    return feature.properties.name;
                }
            }
        }
    }
    return null;
}
