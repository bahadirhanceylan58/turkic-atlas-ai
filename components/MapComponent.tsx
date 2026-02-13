"use client";
// forcing rebuild

import React, { useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
// import type { FeatureCollection } from 'geojson';
// import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBlockProps {
  selectedYear: number;
  onStateClick: (stateName: string) => void;
}

const MapComponent: React.FC<MapBlockProps> = ({ selectedYear, onStateClick }) => {
  // Access token from environment variable
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Filter data based on selected year
  // We will use Mapbox filters for performance, but we also need the data source
  // Assuming data is loaded from /data/history.json
  // For simplicity, we'll fetch it or import it. unique for now, fetch in useEffect or useSWR is better, 
  // but for MVP we can just import if it's small, or fetch.
  // Let's use simple fetch for now.

  const [geoData, setGeoData] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch('/data/history.json')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  // Create specific filters for each layer type to avoid complex nesting issues
  const stateFilter = useMemo(() => {
    return [
      'all',
      ['<=', 'startYear', selectedYear],
      ['>=', 'endYear', selectedYear],
      ['==', 'type', 'state']
    ];
  }, [selectedYear]);

  const migrationFilter = useMemo(() => {
    return [
      'all',
      ['<=', 'startYear', selectedYear],
      ['>=', 'endYear', selectedYear],
      ['==', 'type', 'migration']
    ];
  }, [selectedYear]);

  const fillLayer = {
    id: 'states-fill',
    type: 'fill',
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.5
    }
  };

  const migrationLayer = {
    id: 'migration-layer',
    type: 'line',
    paint: {
      'line-color': '#FF9800',
      'line-width': 3,
      'line-dasharray': [2, 1]
    }
  };

  const lineLayer = {
    id: 'states-outline',
    type: 'line',
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 1
    }
  };

  const onMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature) {
      onStateClick(feature.properties.name);
    }
  };

  if (!mapboxToken) {
    return <div className="text-white p-10">Mapbox Token Missing</div>;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <Map
        initialViewState={{
          longitude: 65,
          latitude: 40,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        interactiveLayerIds={['states-fill']}
        onClick={onMapClick}
      >
        {geoData && (
          <Source id="history-data" type="geojson" data={geoData}>
            {/* @ts-ignore */}
            <Layer {...fillLayer} filter={stateFilter} />
            {/* @ts-ignore */}
            <Layer {...lineLayer} filter={stateFilter} />
            {/* @ts-ignore */}
            <Layer {...migrationLayer} filter={migrationFilter} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
